import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import Attendencefrom from "../../Forms/Attendenceform.jsx";
import Attendencecard from "../../Cards/Attendencecard.jsx";
import authService from "../../Appwrite/AuthService.js";
import scheduleService, {
  ScheduleService,
} from "../../Appwrite/ScheduleService.js";
function Home() {
  const [addSubject, setaddSubject] = useState(false);
  const [subject, setsubject] = useState([]);
  const [userId, setuserId] = useState("");
  const toggleshowing = () => {
    setaddSubject(!addSubject);
  };

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setuserId(user.$id);
          const data = await scheduleService.getTodayClasses(user.$id);
          if (data) {
            setsubject(data);
            console.log("Subject", data);
          } else {
            setsubject([]);
          }
        }
      } catch (error) {
        console.error("Error loading subjects");
      }
    };
    fetchSubject();
  }, []);

  const refreshSubjects = async () => {
    if (!userId) return;
    const data = await scheduleService.getTodayClasses(userId);
    if (data) {
      setsubject(data);
    } else {
      setsubject([]);
    }
    setaddSubject(false);
  };
  return (
    <div>
      <Attendencecard subject={subject} />
      <Button title="Add" className="Adding" onClick={toggleshowing} />
      {addSubject && <Attendencefrom onSubjectAdded={refreshSubjects} />}
    </div>
  );
}
export default Home;
