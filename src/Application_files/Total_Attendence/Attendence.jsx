import React, { useEffect, useState } from "react";
import classAttendService from "../../Appwrite/ClassAttendService.js";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
export default function Total_Attendence({ subjectId, userId, subjectName }) {
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [extraclass, setExtraClass] = useState(false);
  const ExtraClass = () => {
    setExtraClass(!extraclass);
  };

  useEffect(() => {
    const fetchTotalAttendance = async () => {
      const attendance = await classAttendService.TotalAttendance(
        userId,
        subjectId
      );
      setTotalAttendance(attendance);
    };

    fetchTotalAttendance();
  }, [userId, subjectId]);

  return (
    <div>
      <Button title="+ extra Class" onClick={ExtraClass} />
      {extraclass && (
        <div>
          <Button title="Present" />
          <Button title="Absent" />
          <Button title="Cancel" onClick={ExtraClass} />
        </div>
      )}
      <h2>Total Attendance for Subject : {subjectName}</h2>
      <p>{totalAttendance}%</p>
    </div>
  );
}
