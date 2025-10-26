import React, { useEffect, useState } from "react";
import classAttendService from "../../Appwrite/ClassAttendService.js";
import Button from "../../Common_Componenets/Common_Button/Button.jsx";
import ExtraClassform from "../../Forms/ExtraClassform.jsx";
export default function Total_Attendence({ subjectId, userId, subjectName }) {
  const [totalAttendance, setTotalAttendance] = useState(0);
  const [extraclass, setExtraClass] = useState(false);
  const ExtraClass = () => {
    setExtraClass(!extraclass);
  };
  const fetchTotalAttendance = async () => {
    const attendance = await classAttendService.TotalAttendance(
      userId,
      subjectId
    );
    setTotalAttendance(attendance);
  };
  useEffect(() => {
    fetchTotalAttendance();
  }, [userId, subjectId]);

  const handleExtraClass = async (data) => {
    try {
      await classAttendService.addExtreClass({
        UserID: userId,
        SubjectName: subjectName,
        SubjectID: subjectId,
        ClassDay: data.day,
        ClassTime: data.time,
        ClassDate: data.date,
        Status: data.status,
      });
      ExtraClass();
      fetchTotalAttendance();
    } catch (error) {
      console.error("Error adding extra class : ", error);
    }
  };

  return (
    <div>
      <h2>Total Attendance for Subject : {subjectName}</h2>
      <p>{totalAttendance}%</p>
      <Button title="+ extra Class" onClick={ExtraClass} />
      {extraclass && (
        <div>
          <ExtraClassform onextraClass={handleExtraClass} />
          <Button title="Cancel" onClick={ExtraClass} />
        </div>
      )}
    </div>
  );
}
