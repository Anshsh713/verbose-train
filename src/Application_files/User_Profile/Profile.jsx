import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import scheduleService from "../../Appwrite/ScheduleService";

export default function Profile() {
  const [subjects, setSubjects] = useState([]);
  const { user } = useUser();

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>{user.email}</p>

      {subjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        subjects.map((subj) => (
          <div
            key={subj.$id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <h2>{subj.SubjectName}</h2>
            <ul>
              {subj.ClassesSchedule?.map((item, index) => {
                const schedule =
                  typeof item === "string" ? JSON.parse(item) : item;
                return (
                  <li key={index}>
                    <strong>{schedule.day}</strong> — {schedule.time}
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
