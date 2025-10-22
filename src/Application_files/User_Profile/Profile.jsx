import React, { useEffect, useState } from "react";
import authService from "../../Appwrite/AuthService";
import scheduleService from "../../Appwrite/ScheduleService";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const data = await scheduleService.getUserSubject(currentUser.$id);
          if (data) {
            setSubjects(data);
            console.log("Subject Data:", data);
          } else {
            setSubjects([]);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error.message);
      }
    };

    loadUserData();
  }, []);

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
