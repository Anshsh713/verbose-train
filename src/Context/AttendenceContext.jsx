import React, { createContext, useContext, useState } from "react";
import classAttendService from "../Appwrite/ClassAttendService";
import { useUser } from "./UserContext";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { user } = useUser();
  const [loading, setloading] = useState(true);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const today = new Date().toISOString().split("T")[0];
  const dayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const loadfromcacheforAttendence = () => {
    try {
      const cache = JSON.parse(localStorage.getItem("AttendClassesCache"));
      console.log("getting data : ", cache);
      if (
        cache &&
        cache.userId === user?.$id &&
        cache.timestamp === today &&
        Object.keys(cache.attendancerecords || {}).length > 0
      ) {
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
    const cache = {
      userId: user?.$id,
      timestamp: today,
      ...data,
    };
    console.log("Adding data : ", cache);
    localStorage.setItem("AttendClassesCache", JSON.stringify(cache));
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
    } catch (error) {
      console.error("Error in marking attendance:", error);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{ attendanceRecords, fetchAttendance, markAttendance }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => useContext(AttendanceContext);
