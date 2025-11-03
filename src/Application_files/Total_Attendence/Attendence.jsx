import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import ExtraClassform from "../../Forms/ExtraClassform.jsx";
import { useAttendance } from "../../Context/AttendenceContext.jsx";
export default function Total_Attendence({ subject = [], refresh_Trigger }) {
  const { TotalAttendence, totalAttendance } = useAttendance();
  const [extraclass, setExtraClass] = useState(false);
  const ExtraClass = () => {
    setExtraClass(!extraclass);
  };
  useEffect(() => {
    TotalAttendence();
  }, [refresh_Trigger, subject]);
  if (!subject.length) return <p>No subjects found.</p>;
  return (
    <div>
      <h2>Your Attendence</h2>
      {subject.map((subj) => (
        <div key={subj.$id}>
          <h2>Total Attendance for Subject : {subj.SubjectName}</h2>
          <p>{totalAttendance[subj.$id] || 0}%</p>
          <Button title="+ extra Class" onClick={ExtraClass} />
          {extraclass && (
            <div>
              <ExtraClassform onextraClass={handleExtraClass} />
              <Button title="Cancel" onClick={ExtraClass} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
