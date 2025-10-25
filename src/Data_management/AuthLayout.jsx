import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === null) return;
    if (authentication && !authStatus) {
      navigate("/about");
    } else if (!authentication && authStatus) {
      navigate("/home");
    }
    setLoading(false);
  }, [authStatus, navigate, authentication]);

  if (loading) return null;

  return <>{children}</>;
}
