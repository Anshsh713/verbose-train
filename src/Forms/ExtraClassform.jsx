import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
export default function ExtraClassform({
  subjectID,
  subjectName,
  onextraClass,
}) {
  const Today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const [Day, setDay] = useState("");
  const [date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      subjectID,
      subjectName,
      day: Today,
      date: date,
      time: Time,
      status: status,
    };

    const success = await onextraClass(data);
    if (success) {
      setDay("");
      setDate("");
      setTime("");
      setStatus("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Extra Class</h2>
      <h1>
        Day : <p>{Today}</p>
      </h1>
      <Input
        label="Class Date : "
        type="date"
        placeholder="Enter yout Extra class Date"
        required
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        label="Class Time : "
        type="Time"
        required
        value={Time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Input
        label="Present"
        type="radio"
        name="status"
        value="Present"
        checked={status === "Present"}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Input
        label="Absent"
        type="radio"
        name="status"
        value="Absent"
        checked={status === "Absent"}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button type="submit" title="Submit" />
    </form>
  );
}
