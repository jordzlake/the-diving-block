"use client";

import "./register.css";

import { FaArrowRight } from "react-icons/fa6";
import FormInput from "@/components/controls/form/input/FormInput";
import { useState } from "react";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { userSchema } from "@/lib/schema";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/userActions";
import { toast } from "react-toastify";

export const dynamic = "force-dynamic";

const Register = () => {
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    const data = { formData };
    const result = await createUser(data);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    toast.success("Registration Successful");
    router.push("/login");
  };

  return (
    <main>
      <section className="register-container">
        <div className="register-content-container container">
          <form className="register-form">
            <h2 className="register-form-heading">Register</h2>
            <p className="register-form-text">
              Follow the intructions below to register a new account.
            </p>
            <div className="register-form-fields">
              <FormInput
                label="Enter your email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={false}
                validationSchema={userSchema.shape.email}
              />
              <FormInput
                label="Enter your first name"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.firstName}
              />
              <FormInput
                label="Enter your last name"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.lastName}
              />
              <FormInput
                label="Enter your city name"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.city}
              />
              <FormInput
                label="Enter your street name"
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.street}
              />
              <FormInput
                label="Enter your phone number"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required={true}
                validationSchema={userSchema.shape.phone}
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
            <div className="register-button-container">
              <button
                className="register-button action-button"
                onClick={handleSubmit}
              >
                Register <FaArrowRight />
              </button>
              <button
                className="register-button"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
              >
                Have an account? Login <FaArrowRight />
              </button>
            </div>

            <ErrorContainer errors={errors} />
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
