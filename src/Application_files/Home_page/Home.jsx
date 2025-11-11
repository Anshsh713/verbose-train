import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import Attendencefrom from "../../Forms/Attendenceform.jsx";
import Attendencecard from "../../Cards/Attendencecard.jsx";
import { useSchedule } from "../../Context/ScheduleContext.jsx";
import Total_Attendence from "../Total_Attendence/Attendence.jsx";
import ExtraClasscard from "../../Cards/ExtraClassAttendencecard.jsx";
function Home() {
  const { allSubjects, todayClasses, refreshSchedule } = useSchedule();
  const [addSubject, setaddSubject] = useState(false);
  const [refresh_Attendence, setRefresh_Attendence] = useState(false);
  const handleAttendanceRefresh = () => {
    setRefresh_Attendence((prev) => !prev);
  };
  const toggleshowing = () => {
    setaddSubject(!addSubject);
  };
  return (
    <>
      <div>
        <Attendencecard
          subject={todayClasses}
          onAttendenceMarked={handleAttendanceRefresh}
        />
        <Button title="Add" className="Adding" onClick={toggleshowing} />
        {addSubject && <Attendencefrom onSubjectAdded={refreshSchedule} />}
      </div>
      <ExtraClasscard />
      <div>
        {allSubjects.map((subj) => (
          <Total_Attendence
            key={subj.$id}
            subject={subj}
            refresh_Trigger={refresh_Attendence}
          />
        ))}
      </div>
    </>
  );
}
export default Home;
