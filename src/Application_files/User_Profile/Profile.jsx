import React, { useEffect, useState } from "react";
import { useUser } from "../../Context/UserContext";
import { useSchedule } from "../../Context/ScheduleContext";

export default function Profile() {
  const { user } = useUser();
  const { allSubjects, refreshSchedule, loading } = useSchedule();

  useEffect(() => {
    if (!allSubjects || allSubjects.length === 0) {
      refreshSchedule();
    }
  }, []);

  if (loading) return <p>...Loading Profille</p>;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>{user.email}</p>

      {allSubjects.length === 0 ? (
        <p>No subjects found.</p>
      ) : (
        allSubjects.map((subj) => (
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
