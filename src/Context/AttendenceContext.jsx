import React, { createContext, useContext, useState } from "react";
import classAttendService from "../Appwrite/ClassAttendService";
import { useUser } from "./UserContext";
import { useLocalStorage } from "./LocalStorageContext";
import { useSchedule } from "./ScheduleContext";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { allSubjects } = useSchedule();
  const { user } = useUser();
  const { LoadData, SaveData } = useLocalStorage();
  const [loading, setloading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [totalAttendance, setTotalAttendance] = useState({});

  const loadfromcacheforAttendence = () => {
    try {
      const cache = LoadData("AttendClassesCache");
      if (cache) {
        setAttendanceRecords(cache.attendancerecords);
        setloading(false);
        console.log("data of attendence from local storage", attendanceRecords);
        return true;
      }
    } catch (error) {
      console.error("NOT able to get attendence : ", error);
    }
    return false;
  };

  const saveToCache = (data) => {
    SaveData("AttendClassesCache", {
      ...data,
    });
  };

  const TotalAttendence = async (subjectId) => {
    if (!user || !allSubjects?.length) return;
    setloading(true);
    const Attendence_Local_Storage =
      JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
    if (Attendence_Local_Storage[subjectId] !== undefined) {
      setTotalAttendance((prev) => ({
        ...prev,
        [subjectId]: Attendence_Local_Storage[subjectId],
      }));
      setloading(false);
      return;
    }
    try {
      const data = await classAttendService.TotalAttendance(
        user.$id,
        subjectId
      );
      setTotalAttendance((prev) => ({
        ...prev,
        [subjectId]: data,
      }));
      localStorage.setItem(
        "TotalAttendanceCache",
        JSON.stringify({ ...Attendence_Local_Storage, [subjectId]: data })
      );
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setloading(false);
    }
  };

  const fetchAttendance = async (subjects) => {
    if (!user || !subjects?.length) return;
    setloading(true);
    if (loadfromcacheforAttendence()) {
      setloading(false);
      return;
    }
    try {
      const allRecords = {};
      const data = await classAttendService.getAttendanceByDate(
        user.$id,
        today,
        dayName
      );
      data.forEach((rec) => {
        const key = `${rec.SubjectID}_${rec.ClassDay}_${rec.ClassTime}`;
        allRecords[key] = rec;
      });
      setAttendanceRecords(allRecords);
      saveToCache({
        attendancerecords: allRecords || [],
      });
      console.log("Fetched the Attendence");
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setloading(false);
    }
  };

  const markAttendance = async (status, subj, schedule) => {
    if (!user) return;
    try {
      await classAttendService.markAttendance(
        user.$id,
        subj.subjectName,
        subj.subjectId,
        schedule.day,
        schedule.time,
        today,
        status
      );
      const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
      const updatedRecords = {
        ...attendanceRecords,
        [key]: {
          Status: status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
        },
      };

      setAttendanceRecords(updatedRecords);
      saveToCache({ attendancerecords: updatedRecords });
      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[subj.subjectId];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));
    } catch (error) {
      console.log("Not Able to Mark the Attendence", error);
    }
  };

  const handleExtraClass = async (data) => {
    if (!user) return false;
    try {
      await classAttendService.addExtraClass(
        user.$id,
        data.subjectName,
        data.subjectID,
        data.day,
        data.time,
        data.date,
        data.status
      );

      const totalCache =
        JSON.parse(localStorage.getItem("TotalAttendanceCache")) || {};
      delete totalCache[data.subjectID];
      localStorage.setItem("TotalAttendanceCache", JSON.stringify(totalCache));

      console.log("✅ Extra class added and cache cleared!");
      return true;
    } catch (error) {
      console.log("❌ Error adding extra class:", error);
      return false;
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendanceRecords,
        fetchAttendance,
        markAttendance,
        loading,
        TotalAttendence,
        totalAttendance,
        handleExtraClass,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
