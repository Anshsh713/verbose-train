import React, { createContext, useContext, useState } from "react";
import classAttendService from "../Appwrite/ClassAttendService";
import { useUser } from "./UserContext";

const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  const { user } = useUser();
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const today = new Date().toISOString().split("T")[0];

  const fetchAttendance = async (subjects) => {
    if (!user || !subjects?.length) return;
    try {
      const allRecords = {};
      await Promise.all(
        subjects.map(async (subj) => {
          const data = await classAttendService.getAttendanceByDate(
            user.$id,
            today,
            subj.subjectId
          );
          data.forEach((rec) => {
            const key = `${subj.subjectId}_${rec.ClassDay}_${rec.ClassTime}`;
            allRecords[key] = rec;
          });
        })
      );
      setAttendanceRecords(allRecords);
    } catch (error) {
      console.error("Error fetching attendance:", error);
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
      setAttendanceRecords((prev) => ({
        ...prev,
        [key]: {
          Status: status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
        },
      }));
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
