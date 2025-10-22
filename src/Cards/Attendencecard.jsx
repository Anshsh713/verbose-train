import React from "react";
import Button from "../Common_Componenets/Common_Button/Button";
export default function Attendencecard({ subject = [] }) {
  if (subject.length === 0) return <p>No subjects added yet.</p>;

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
              <Button title="Present" />
              <Button title="Absent" />
              <Button title="Canceled" />
            </div>
          </ul>
        </div>
      ))}
    </div>
  );
}
