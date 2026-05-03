import React, { useState, useRef } from "react";
import { User, Mail, Camera, BadgeCheck, ShieldCheck, Check } from "lucide-react";
import Button from "../../common/Button";
import FormInput from "../../common/FormInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

const profileSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ProfileSettings: React.FC = () => {
  // Get user from sessionStorage
  const userJson = sessionStorage.getItem("user");
  const adminData = userJson ? JSON.parse(userJson) : null;

  const [avatar, setAvatar] = useState(adminData?.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!adminData) return null;

  return (
    <div className="max-w-2xl mx-auto py-4">
      <div className="flex flex-col gap-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] bg-primary/10 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-primary" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:rotate-12"
            >
              <Camera size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleAvatarChange} 
            />
          </div>
          
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-black text-[#101828]">
                {adminData.firstName} {adminData.lastName}
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                <BadgeCheck size={12} />
                {adminData.role || "Admin"}
              </div>
            </div>
            <p className="text-[#667085] font-medium">{adminData.email}</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[32px] border border-[#F2F4F7] p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-bold text-[#101828]">Personal Information</h3>
          </div>

          <Formik
            initialValues={{
              firstName: adminData.firstName || "",
              lastName: adminData.lastName || "",
              email: adminData.email || "",
            }}
            validationSchema={profileSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                // Update session storage for mock persist
                const updatedUser = { ...adminData, ...values, avatarUrl: avatar };
                sessionStorage.setItem("user", JSON.stringify(updatedUser));
                toast.success("Profile updated successfully!");
                setSubmitting(false);
                // Trigger a page reload or event to update UI in other components if needed
                window.dispatchEvent(new Event('storage'));
              }, 1000);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting, dirty }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormInput
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstName && errors.firstName}
                    icon={<User size={18} />}
                  />
                  <FormInput
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastName && errors.lastName}
                    icon={<User size={18} />}
                  />
                </div>

                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  icon={<Mail size={18} />}
                  disabled
                />

                <div className="pt-4">
                  <Button
                    label="Save Profile Changes"
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={(!dirty && avatar === adminData.avatarUrl) || isSubmitting}
                    icon={<Check size={18} />}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
