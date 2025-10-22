import React,{useState} from "react";
import Input from "../../../Common_Componenets/Common_Input/Input.jsx";
import {Link , useNavigate} from"react-router-dom";
import {login as authLogin} from "../../../Store/AuthSlice.js";
import {useDispatch} from "react-redux";
import {useForm} from "react-hook-form";
import authservice from "../../../Appwrite/AuthService";


function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError("");
        try {
            const userData = await authservice.createAccount(data);
            if (userData) {
                const currentUser = await authservice.getCurrentUser();
                if (currentUser) {
                    dispatch(authLogin(currentUser));
                    navigate("/");
                }
            }
        } catch (error) {
            
            setError(error.message);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign up to create an account</h2>
            <p>Already have an account? <Link to="/login">Sign In</Link></p>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit(create)} className="signup-form">
                <div className="input-group">
                    <label>Full Name:</label>
                    <Input  
                        placeholder="Enter your full name"
                        {...register("name", { required: "Full name is required" })}
                    />
                </div>

                <div className="input-group">
                    <label>Email:</label>
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                message: "Invalid email format",
                            },
                        })}
                    />
                </div>

                <div className="input-group">
                    <label>Password:</label>
                    <Input  
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", { required: "Password is required" })}
                    />
                </div>

                <button type="submit" className="signup-button">Create Account</button>
            </form>
        </div>
    );
}

export default Signup;