import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Children,
} from "react";
import authService from "../Appwrite/AuthService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch (error) {
        console.error("Error fetching user : ", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
