import React, { useContext, createContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const LocalStorageContext = createContext();

export const LocalStorageProvider = ({ children }) => {
  const { user } = useUser();
  const [loading, setloading] = useState(true);

  const CHECK_EXPIREY = new Date().toLocaleDateString("en-CA");
  console.log(CHECK_EXPIREY);
  const LoadData = (key) => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (
        data &&
        data.userId === user?.$id &&
        data.timestamp === CHECK_EXPIREY
      ) {
        setloading(false);
        return data;
      } else {
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      console.error("NOt able to get data : ", error);
    }
    return null;
  };

  const SaveData = (key, data) => {
    try {
      const cache = {
        userId: user.$id,
        timestamp: CHECK_EXPIREY,
        ...data,
      };
      localStorage.setItem(key, JSON.stringify(cache));
    } catch (error) {
      console.error("Unable to get the Data :", error);
    }
  };

  return (
    <LocalStorageContext.Provider value={{ LoadData, SaveData, loading }}>
      {children}
    </LocalStorageContext.Provider>
  );
};

export const useLocalStorage = () => useContext(LocalStorageContext);
