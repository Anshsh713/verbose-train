import React, { useEffect, useState } from "react";
import { useAttendance } from "../Context/AttendenceContext";
import Button from "../Common_Componenets/Common_Button/Button";
import UpdateExtraClassAttendenceform from "../Forms/UpdateExtraClassAttendenceform";
export default function ExtraClasscard({ subject = [] }) {
  const { fetchExtraClass, extraclassesRecords, UpdateExtraClassAttendence } =
    useAttendance();
  const [mistake, setMistake] = useState(null);
  const togglemistake = (key) => {
    setMistake((prev) => (prev === key ? null : key));
  };
  useEffect(() => {
    fetchExtraClass();
  }, []);

  const record = Object.values(extraclassesRecords || {});

  if (record.length === 0) return <p>No Extra Classes Added yet</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>📚 Extra Classes</h2>
      {record.map((rec, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <p>
            <strong>{rec.SubjectName}</strong> — {rec.ClassDay} @{" "}
            {rec.ClassTime}
          </p>
          <p>Status: {rec.Status}</p>
          <p>Date: {rec.ClassDate}</p>
          <Button title="Mistake" onClick={() => togglemistake(index)} />
          {mistake === index && (
            <UpdateExtraClassAttendenceform
              UpdateExtraCLASS={async (data) => {
                const success = await UpdateExtraClassAttendence(rec, data);
                if (success) {
                  setMistake(null);
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
