import React, { useEffect, useState } from "react";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import ExtraClassform from "../../Forms/ExtraClassform.jsx";
import { useAttendance } from "../../Context/AttendenceContext.jsx";

export default function Total_Attendence({ subject, refresh_Trigger }) {
  const { TotalAttendence, totalAttendance, handleExtraClass } =
    useAttendance();
  const [extraclass, setExtraClass] = useState(false);

  const ExtraClass = () => {
    setExtraClass((prev) => !prev);
  };

  useEffect(() => {
    TotalAttendence(subject.$id);
  }, [refresh_Trigger, subject]);

  if (!subject || !subject.$id) return <p>No subject found.</p>;

  return (
    <div>
      <h2>Total Attendance for Subject: {subject.SubjectName}</h2>
      <p>{totalAttendance[subject.$id] || 0}%</p>

      <Button title="+ Extra Class" onClick={ExtraClass} />

      {extraclass && (
        <div>
          <ExtraClassform onextraClass={handleExtraClass} />
          <Button title="Cancel" onClick={ExtraClass} />
        </div>
      )}
    </div>
  );
}
