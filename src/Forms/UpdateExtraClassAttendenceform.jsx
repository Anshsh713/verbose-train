import React, { useState } from "react";
import Input from "../Common_Componenets/Common_Input/Input";
import Button from "../Common_Componenets/Common_Button/Button";

export default function UpdateExtraClassAttendenceform({ UpdateExtraCLASS }) {
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!status) return alert("Please select a status");
    const success = await UpdateExtraCLASS({ Status: status });
    if (success) {
      setStatus("");
    }
  };
  return (
    <form onSubmit={handleUpdate}>
      <h2>Update Attendence</h2>
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
      <Input
        label="Canceled"
        type="radio"
        name="status"
        value="Canceled"
        checked={status === "Canceled"}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Button type="submit" title="Update" />
    </form>
  );
}
