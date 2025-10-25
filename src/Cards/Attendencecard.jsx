import React, { useEffect, useState } from "react";
import Button from "../Common_Componenets/Common_Button/Button";
import classAttendService from "../Appwrite/ClassAttendService.js";

export default function Attendencecard({ subject = [] }) {
  const [lastAction, setLastAction] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const initAttendance = async () => {
      try {
        const allRecords = {};

        // Map each subject to a promise for fetching + marking NOT
        await Promise.all(
          subject.map(async (subj) => {
            // 1️⃣ Fetch today's attendance for this subject
            const data = await classAttendService.getAttendanceByDate(
              subj.userId,
              today,
              subj.subjectId
            );

            // Store fetched attendance
            data.forEach((rec) => {
              const key = `${subj.subjectId}_${rec.ClassDay}_${rec.ClassTime}`;
              allRecords[key] = rec;
            });

            // 2️⃣ Mark unmarked schedules as NOT in parallel
            await Promise.all(
              (subj.schedules || []).map(async (schedule) => {
                const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
                if (!allRecords[key]) {
                  const res = await classAttendService.markAsNot(
                    subj.userId,
                    subj.subjectId,
                    schedule.day,
                    schedule.time,
                    today
                  );
                  if (res.success) {
                    allRecords[key] = {
                      Status: "NOT",
                      ClassDay: schedule.day,
                      ClassTime: schedule.time,
                    };
                  }
                }
              })
            );
          })
        );

        // Update state once after all API calls complete
        setAttendanceRecords(allRecords);
        console.log("Attendance initialized:", allRecords);
      } catch (error) {
        console.error("Error initializing attendance:", error);
      }
    };

    if (subject.length) initAttendance();
  }, [subject, today]);

  const handleAttendance = async (status, subj, schedule) => {
    try {
      await classAttendService.markAttendance(
        subj.userId,
        subj.subjectName,
        subj.subjectId,
        schedule.day,
        schedule.time,
        today,
        status
      );

      const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
      setAttendanceRecords((prev) => ({
        ...prev,
        [key]: {
          Status: status,
          ClassDay: schedule.day,
          ClassTime: schedule.time,
        },
      }));

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
            {subj.schedules?.map((schedule, index) => {
              const key = `${subj.subjectId}_${schedule.day}_${schedule.time}`;
              const record = attendanceRecords[key];

              return (
                <li key={index}>
                  <strong>{schedule.day}</strong> — {schedule.time}
                  <div style={{ marginTop: "5px" }}>
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
      {lastAction && <p>Last action: {lastAction}</p>}
    </div>
  );
}
