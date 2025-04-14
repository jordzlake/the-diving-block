"use client";

import "./login.css";

import { FaArrowRight } from "react-icons/fa6";
import FormInput from "@/components/controls/form/input/FormInput";
import { useState } from "react";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { userSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { handleCredentialsSignIn } from "@/lib/actions/authActions";

export const dynamic = "force-dynamic";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await handleCredentialsSignIn(formData);
    console.log(result);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
  };

  return (
    <main>
      <section className="login-container">
        <div className="login-content-container container">
          <form className="login-form">
            <h2 className="login-form-heading">Login</h2>
            <p className="login-form-text">
              Follow the intructions below to login.
            </p>
            <div className="login-form-fields">
              <FormInput
                label="Enter your email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.email}
              />
              <FormInput
                label="Enter your password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.password}
              />
            </div>
            <div className="login-button-container">
              <button
                className="login-button action-button"
                onClick={handleSubmit}
              >
                Login <FaArrowRight />
              </button>
              <button
                className="login-button register-button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/register");
                }}
              >
                Register <FaArrowRight />
              </button>
            </div>
            <ErrorContainer errors={errors} />
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
