"use client";

import "@/app/profile/profile.css";
import Link from "next/link";
import Image from "next/image";
import FormInput from "@/components/controls/form/input/FormInput";
import { useEffect, useState } from "react";
import { userSchema } from "@/lib/schema";
import { updateUser } from "@/lib/userActions";
import { useRouter } from "next/navigation";
import ErrorContainer from "@/components/controls/errors/ErrorContainer";
import { toast } from "react-toastify";

import { FaArrowRight } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { Loading } from "@/components/controls/loading/Loading";

export const dynamic = "force-dynamic";

const Profile = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    city: "",
    street: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    const data = { ...formData };
    const result = await updateUser(data);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    await update({
      ...session,
      user: {
        ...session?.user,
        ...data, // Spreading the new form data into the session
      },
    });
    toast.success("User Updated Successfully");
    router.push("/profile");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (session?.user) {
      (async () => {
        try {
          const user = session?.user;
          console.log("user", user);
          setFormData({
            id: user._id || "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            city: user.city || "",
            street: user.street || "",
            phone: user.phone || "",
            email: user.email || "",
            password: "",
          });
          setLoading(false);
        } catch (err) {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <main>
      <section className="profile-container">
        {!loading && session?.user ? (
          <>
            <div className="profile-banner-content-container container">
              <h1 className="profile-banner-content-title">Profile Info</h1>
            </div>
            <div className="profile-info-content-container container">
              <p className="profile-info-content">
                Edit profile information by changing the fields:
              </p>
            </div>
            <div className="profile-form container">
              <div className="register-container">
                <div className="register-form-fields">
                  <FormInput
                    label="Enter new email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={false}
                    validationSchema={userSchema.shape.email}
                  />
                  <FormInput
                    label="Enter new first name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.firstName}
                  />
                  <FormInput
                    label="Enter new last name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.lastName}
                  />
                  <FormInput
                    label="Enter new city name"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.city}
                  />
                  <FormInput
                    label="Enter new street name"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.street}
                  />
                  <FormInput
                    label="Enter new phone number"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={true}
                    validationSchema={userSchema.shape.phone}
                  />
                  <FormInput
                    label="Enter new password (Leave blank to keep current password)"
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
                    Change your info <FaArrowRight />
                  </button>
                  <button
                    className="register-button"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/orders");
                    }}
                  >
                    Orders <FaArrowRight />
                  </button>
                </div>
              </div>
              <ErrorContainer errors={errors} />
            </div>
          </>
        ) : !loading && !session?.user ? (
          <div className="profile-banner-content-container container">
            <h1 className="profile-banner-content-title">
              You are not logged in
            </h1>
          </div>
        ) : (
          <Loading />
        )}
      </section>
    </main>
  );
};

export default Profile;
