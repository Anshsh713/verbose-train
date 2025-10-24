// Commit: Added per-schedule attendance tracking, conditional button hiding, and lastAction updates

import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import classAttendService from "../Appwrite/ClassAttendService.js";

export default function Attendencecard({ subject = [] }) {
  // State to store the last action message (e.g., "Marked Present")
  const [lastAction, setLastAction] = useState("");

  // State to store attendance records per schedule (unique key per subject + day + time)
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const records = {}; // object to store attendance per schedule

        for (const subj of subject) {
          // Get today's attendance for this subject from backend
          const data = await classAttendService.getAttendanceByDate(
            subj.userId,
            today,
            subj.subjectId
          );

          // Loop through fetched attendance and store in records
          data.forEach((rec) => {
            // Create unique key for each schedule
            const key = `${subj.subjectId}_${rec.ClassDay}_${rec.ClassTime}`;
            records[key] = rec; // store the record
          });
        }

        // Update state so UI can render marked attendance
        setAttendanceRecords(records);

        console.log("Fetched attendance records:", records);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    if (subject.length) fetchAttendance();
  }, [subject, today]);

  // 2️⃣ Handle marking attendance (Present, Absent, Canceled)
  const handleAttendance = async (status, subj, schedule) => {
    try {
      // Call service to mark attendance in the backend
      await classAttendService.markAttendance(
        subj.userId,
        subj.subjectName,
        subj.subjectId,
        schedule.day,
        schedule.time,
        today,
        status
      );

      // Create the same unique key as used in fetchAttendance
      const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;

      // Update local state so UI reflects the change immediately
      setAttendanceRecords((prev) => ({
        ...prev,
        [key]: {
          Status: status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
        },
      }));

      // Update last action message for user feedback
      setLastAction(
        `Marked "${status}" for ${subj.subjectName} on ${schedule.day} at ${schedule.time}`
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
      setLastAction(`Error marking attendance: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Your Subjects</h2>

      {/* Loop through each subject */}
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
            {/* Loop through each schedule for the subject */}
            {subj.schedules?.map((schedule, index) => {
              // Create unique key to check attendance per schedule
              const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
              const record = attendanceRecords[key]; // Get attendance info for this schedule

              return (
                <li key={index}>
                  <strong>{schedule.day}</strong> — {schedule.time}
                  <div style={{ marginTop: "5px" }}>
                    {/* If attendance already marked, show status; else show buttons */}
                    {record ? (
                      <span>Your attendance is marked: {record.Status}</span>
                    ) : (
                      <>
                        <Button
                          title="Present"
                          onClick={() =>
                            handleAttendance("Present", subj, schedule)
                          }
                        />
                        <Button
                          title="Absent"
                          onClick={() =>
                            handleAttendance("Absent", subj, schedule)
                          }
                        />
                        <Button
                          title="Canceled"
                          onClick={() =>
                            handleAttendance("Canceled", subj, schedule)
                          }
                        />
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {/* Show the last action feedback */}
      {lastAction && <p>Last action: {lastAction}</p>}
    </div>
  );
}
