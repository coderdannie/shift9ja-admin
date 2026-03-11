import React from 'react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { changePassInitValues, changePassValidateSchema } from '../../utils/validation';
import { PUBLIC_PATHS } from '../../routes/constants';

const ChangePassword = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('temp_email');

  if (!email) {
    navigate(PUBLIC_PATHS.LOGIN);
    return null;
  }

  const handleSubmit = (values: typeof changePassInitValues) => {
    // Mocking a successful password change
    toast.success('Password updated successfully! Please login with your new password.');
    setTimeout(() => {
      localStorage.removeItem('temp_email');
      navigate(PUBLIC_PATHS.LOGIN);
    }, 2000);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      <Toaster position="top-right" />
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-[32px] font-bold text-[#101828]">Change Password</h1>
        <p className="text-[#475467] mt-2">Create a new password for your account.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={changePassInitValues}
          validationSchema={changePassValidateSchema}
          onSubmit={handleSubmit}
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
            <Form className="flex flex-col">
              <FormInput
                label="New Password"
                name="newPassword"
                type="password"
                value={values.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.newPassword && errors.newPassword}
                placeholder="Enter new password"
              />
              
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                placeholder="Confirm new password"
              />

              <Button
                type="submit"
                label="Update Password"
                isLoading={isSubmitting}
                disabled={!isValid || !dirty}
                className="mt-4"
              />
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
