import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";
export default function ExtraClassform({ onextraClass }) {
  const [Day, setDay] = useState("");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      day: Day,
      date: Date,
      time: Time,
      status: status,
    };

    if (onextraClass) onextraClass(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Extra Class</h2>
      <select value={Day} onChange={(e) => setDay(e.target.value)}>
        <option value="">Select Day</option>
        <option>Monday</option>
        <option>Tuesday</option>
        <option>Wednesday</option>
        <option>Thursday</option>
        <option>Friday</option>
        <option>Saturday</option>
        <option>Sunday</option>
      </select>
      <Input
        label="Class Date : "
        type="date"
        placeholder="Enter yout Extra class Date"
        required
        value={Date}
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
