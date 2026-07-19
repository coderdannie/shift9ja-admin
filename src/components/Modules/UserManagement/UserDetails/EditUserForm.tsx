import React from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Button from "../../../common/Button";
import FormInput from "../../../common/FormInput";
import { editUserValidateSchema } from "../../../../utils/validation";

interface EditUserFormProps {
  apiData: any;
  user: any;
  updateUser: (data: any, options: any) => void;
  isUpdating: boolean;
  id: string | undefined;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  apiData,
  user,
  updateUser,
  isUpdating,
  id,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-8 pt-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-[#101828] mb-8">
        Edit User Details
      </h2>
      <Formik
        initialValues={{
          firstName: apiData?.firstName || "",
          middleName: apiData?.middleName || "",
          lastName: apiData?.lastName || "",
          email: user.email,
          phone: user.phone !== "N/A" ? user.phone : "",
          address: user.city !== "N/A" ? user.city : "",
        }}
        validationSchema={editUserValidateSchema}
        enableReinitialize
        onSubmit={(values, { setSubmitting }) => {
          updateUser(
            {
              firstName: values.firstName,
              middleName: values.middleName,
              lastName: values.lastName,
              email: values.email,
              phoneNumber: values.phone,
              address: values.address,
            },
            {
              onSuccess: () => {
                toast.success("User updated successfully!");
                navigate(`/user-management/${id}`);
              },
              onSettled: () => setSubmitting(false),
            }
          );
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isValid,
          dirty,
          isSubmitting,
        }) => (
          <Form className="grid grid-cols-1 gap-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInput
                label="First Name"
                name="firstName"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                placeholder="First Name"
              />
              <FormInput
                label="Middle Name"
                name="middleName"
                type="text"
                value={values.middleName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.middleName && errors.middleName}
                placeholder="Middle Name (Optional)"
              />
              <FormInput
                label="Last Name"
                name="lastName"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                placeholder="Last Name"
              />
            </div>
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              placeholder="Email"
            />
            <FormInput
              label="Phone Number"
              name="phone"
              type="text"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
              placeholder="e.g. +2348012345678"
            />
            <FormInput
              label="Address"
              name="address"
              type="text"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
              placeholder="Address"
            />

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <Button
                label="Cancel"
                variant="outline"
                fullWidth={true}
                className="sm:w-32 py-3 border-[#D0D5DD]"
                onClick={() => navigate(`/user-management/${id}`)}
              />
              <Button
                label="Save Changes"
                isLoading={isSubmitting || isUpdating}
                disabled={!isValid || !dirty}
                fullWidth={true}
                className="py-3 flex-1"
                type="submit"
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditUserForm;
