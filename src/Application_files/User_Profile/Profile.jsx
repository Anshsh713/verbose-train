import React, { use, useEffect, useState } from "react";
import authService from "../../Appwrite/AuthService";

export default function Profile() {
  const [user, setuser] = useState(null);

  useEffect(() => {
    const load_user_data = async () => {
      try {
        setuser(await authService.getCurrentUser());
      } catch (error) {
        console.log(error.message);
        throw error;
      }
    };
    load_user_data();
  }, []);
  if (!user) {
    return <p>...Loading</p>;
  }
  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
