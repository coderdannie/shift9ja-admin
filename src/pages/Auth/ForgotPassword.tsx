import React from 'react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeft, Mail } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { forgotPassInitValues, forgotPassValidateSchema } from '../../utils/validation';
import { PUBLIC_PATHS } from '../../routes/constants';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleSubmit = (values: typeof forgotPassInitValues) => {
    // Mocking OTP send
    toast.success('OTP sent successfully to your email!');
    setTimeout(() => {
      localStorage.setItem('reset_email', values.email);
      navigate(PUBLIC_PATHS.VERIFY_OTP);
    }, 1500);
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
        <Link 
          to={PUBLIC_PATHS.LOGIN} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Back to Login
        </Link>
        <h1 className="text-[32px] font-bold text-[#101828]">Forgot Password?</h1>
        <p className="text-[#475467] mt-2">No worries, we'll send you reset instructions.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={forgotPassInitValues}
          validationSchema={forgotPassValidateSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col">
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter your email"
                icon={<Mail size={20} />}
              />

              <Button
                type="submit"
                label="Send OTP"
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

export default ForgotPassword;
