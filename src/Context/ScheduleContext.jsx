import React, { useContext, createContext, useEffect, useState } from "react";
import scheduleService from "../Appwrite/ScheduleService.js";
import { useUser } from "./UserContext.jsx";

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const { user } = useUser();
  const [todayClasses, setTodayClasses] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24;

  const loadfromcache = () => {
    try {
      const cache = JSON.parse(localStorage.getItem("ClassCache"));
      if (
        cache &&
        cache.userId === user?.$id &&
        Date.now() - cache.timestamp < CACHE_EXPIRY_MS
      ) {
        setTodayClasses(cache.todayClasses || []);
        setAllSubjects(cache.allSubjects || []);
        setLoading(false);
        console.log("data got from local storage");
        return true;
      }
    } catch (error) {
      console.error("NOt able to get data : ", error);
    }
    return false;
  };

  const saveToCache = (data) => {
    const cache = {
      userId: user?.$id,
      timestamp: Date.now(),
      ...data,
    };
    localStorage.setItem("ClassCache", JSON.stringify(cache));
  };

  const fetchScheduleData = async (forceRefresh = false) => {
    if (!user) return;
    setLoading(true);
    if (!forceRefresh && loadfromcache()) {
      setLoading(false);
      return;
    }
    try {
      const todayclass = await scheduleService.getTodayClasses(user.$id);
      const subjects = await scheduleService.getUserSubject(user.$id);
      setTodayClasses(todayclass || []);
      setAllSubjects(subjects || []);
      saveToCache({
        todayClasses: todayclass || [],
        allSubjects: subjects || [],
      });
      console.log("Fetched schedule data from Appwrite");
    } catch (error) {
      console.error("Error fetching schedule data : ", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSchedule = async () => {
    await fetchScheduleData(true);
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
