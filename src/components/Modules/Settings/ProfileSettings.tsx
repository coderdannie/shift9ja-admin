import React, { useState, useRef, useEffect } from "react";
import { User, Mail, Camera, BadgeCheck, ShieldCheck, Check, Phone, Loader2 } from "lucide-react";
import Button from "../../common/Button";
import FormInput from "../../common/FormInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { useGetAdminProfile, useUpdateAdminProfile } from "../../../services/query/admin";
import { useGetCloudinarySignature } from "../../../services/query/chat";

const profileSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
});

const ProfileSettings: React.FC = () => {
  const { data: profileData, isLoading: isLoadingProfile } = useGetAdminProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateAdminProfile();
  const { data: signatureData } = useGetCloudinarySignature('avatars');
  
  const adminData = profileData?.data;
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adminData?.avatarUrl) {
      setAvatar(adminData.avatarUrl);
    }
  }, [adminData]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !signatureData?.data) return;

    setIsUploading(true);
    const { signature, timestamp, api_key, cloud_name } = signatureData.data;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", api_key);
    formData.append("timestamp", timestamp.toString());
    formData.append("signature", signature);
    formData.append("folder", "avatars");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, { 
        method: "POST", 
        body: formData 
      });
      const data = await res.json();
      if (data.secure_url) {
        setAvatar(data.secure_url);
        toast.success("Image uploaded! Don't forget to save changes.");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!adminData) return null;

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in duration-500">
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
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 size={32} className="text-white animate-spin" />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 text-primary hover:bg-primary hover:text-white transition-all transform hover:rotate-12 disabled:opacity-50"
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
                {adminData.role?.name || "Admin"}
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
              phoneNumber: adminData.phoneNumber || "",
            }}
            validationSchema={profileSchema}
            onSubmit={(values) => {
              updateProfile({
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                avatarUrl: avatar || undefined,
              }, {
                onSuccess: () => {
                  toast.success("Profile updated successfully!");
                },
                onError: (error: any) => {
                  toast.error(error?.response?.data?.message || "Failed to update profile");
                }
              });
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, dirty }) => (
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <FormInput
                    label="Phone Number"
                    name="phoneNumber"
                    type="text"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phoneNumber && errors.phoneNumber}
                    icon={<Phone size={18} />}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    label="Save Profile Changes"
                    type="submit"
                    isLoading={isUpdating}
                    disabled={(!dirty && avatar === adminData.avatarUrl) || isUpdating || isUploading}
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
