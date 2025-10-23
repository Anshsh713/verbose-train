import React, { useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";

export default function Attendencecard({ subject = [] }) {
  if (subject.length === 0) return <p>No subjects added yet.</p>;

  const [Class, setClass] = useState("");

  const classAttend = (status) => {
    setClass(status);
    console.log("Class Attendance Status:", status);
  };

  return (
    <div>
      <h2>Your Subjects</h2>
      {subject.map((subj) => (
        <div
          key={subj.subjectId}
          style={{
            border: "1px solid #ccc",
            borderRadius: "10px",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          <h3>{subj.subjectName}</h3>

          <ul>
            {subj.schedules?.map((item, index) => (
              <li key={index}>
                <strong>{item.day}</strong> — {item.time}
              </li>
            ))}

            <div>
              <Button title="Present" onClick={() => classAttend("Present")} />
              <Button title="Absent" onClick={() => classAttend("Absent")} />
              <Button
                title="Canceled"
                onClick={() => classAttend("Canceled")}
              />
            </div>
          </ul>
        </div>
      ))}

      {Class && <p>Last action: {Class}</p>}
    </div>
  );
}
