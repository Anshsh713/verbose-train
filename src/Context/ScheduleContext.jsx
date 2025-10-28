import React, { useContext, createContext, useEffect, useState } from "react";
import scheduleService from "../Appwrite/ScheduleService.js";
import { useUser } from "./UserContext.jsx";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const { user } = useUser();
  const [todayClasses, setTodayClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduleData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const todayclass = await scheduleService.getTodayClasses(user.$id);
      const subjects = await scheduleService.getUserSubject(user.$id);
      setTodayClasses(todayclass || []);
      setAllSubjects(subjects || []);
    } catch (error) {
      console.error("Error fetching schedule data : ", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSchedule = async () => {
    await fetchScheduleData();
  };

  useEffect(() => {
    if (user) fetchScheduleData();
  }, [user]);

  return (
    <ScheduleContext.Provider
      value={{ todayClasses, allSubjects, refreshSchedule, loading }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
