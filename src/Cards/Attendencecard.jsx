import React from "react";
import Button from "../Common_Componenets/Common_Button.jsx";
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
          </ul>
        </div>
      ))}
      <div>
        <Button />
      </div>
    </div>
  );
}
