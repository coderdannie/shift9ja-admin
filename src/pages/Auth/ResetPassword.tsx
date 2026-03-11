import React from 'react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { resetPassInitValues, resetPassValidateSchema } from '../../utils/validation';
import { PUBLIC_PATHS } from '../../routes/constants';

const ResetPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: typeof resetPassInitValues) => {
    // Mocking password reset
    toast.success('Password reset successfully! Please login with your new password.');
    setTimeout(() => {
      localStorage.removeItem('reset_email');
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
        <h1 className="text-[32px] font-bold text-[#101828]">Reset Password</h1>
        <p className="text-[#475467] mt-2">Create a new secure password for your account.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={resetPassInitValues}
          validationSchema={resetPassValidateSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col">
              <FormInput
                label="New Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                placeholder="Enter new password"
                icon={<Lock size={20} />}
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
                icon={<Lock size={20} />}
              />

              <Button
                type="submit"
                label="Reset Password"
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

export default ResetPassword;
