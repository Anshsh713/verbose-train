import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import Attendencefrom from "../../Forms/Attendenceform.jsx";
import Attendencecard from "../../Cards/Attendencecard.jsx";
import authService from "../../Appwrite/AuthService.js";
import scheduleService, {
  ScheduleService,
} from "../../Appwrite/ScheduleService.js";
import Total_Attendence from "../Total_Attendence/Attendence.jsx";
function Home() {
  const [addSubject, setaddSubject] = useState(false);
  const [subject, setsubject] = useState([]);
  const [subject_for_attendence, setsubject_for_attendence] = useState([]);
  const [userId, setuserId] = useState("");
  const [refresh_Attendence, setRefresh_Attendence] = useState(false);
  const handleAttendanceRefresh = () => {
    setRefresh_Attendence((prev) => !prev);
  };
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
          const attendence = await scheduleService.getUserSubject(user.$id);
          if (data && attendence) {
            setsubject(data);
            setsubject_for_attendence(attendence);
            console.log("Subject", data);
            console.log("Attendence Subject", attendence);
          } else {
            setsubject([]);
            setsubject_for_attendence([]);
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
    <>
      <div>
        <Attendencecard
          subject={subject}
          onAttendenceMarked={handleAttendanceRefresh}
        />
        <Button title="Add" className="Adding" onClick={toggleshowing} />
        {addSubject && <Attendencefrom onSubjectAdded={refreshSubjects} />}
      </div>
      <div>
        {subject_for_attendence.map((subj) => (
          <div key={subj.$id}>
            <Total_Attendence
              subjectId={subj.$id}
              userId={subj.UserID}
              subjectName={subj.SubjectName}
              refresh_Trigger={refresh_Attendence}
            />
          </div>
        ))}
      </div>
    </>
  );
}
export default Home;
