import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { verifyOtpInitValues, verifyOtpValidateSchema } from '../../utils/validation';
import { PUBLIC_PATHS } from '../../routes/constants';

import { useVerifyOtp, useResendOtp } from '../../services/query/auth';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(30);
  const email = localStorage.getItem('reset_email') || '';
  
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = (values: typeof verifyOtpInitValues) => {
    verifyOtp({ email, otp: values.otp }, {
      onSuccess: () => {
        toast.success('OTP verified successfully!');
        localStorage.setItem('reset_otp', values.otp);
        setTimeout(() => {
          navigate(PUBLIC_PATHS.RESET_PASSWORD);
        }, 1500);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Invalid OTP. Please try again.');
      }
    });
  };

  const handleResend = () => {
    if (timer === 0) {
      resendOtp({ email }, {
        onSuccess: () => {
          toast.success('OTP resent successfully!');
          setTimer(30);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to resend OTP');
        }
      });
    }
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
          to={PUBLIC_PATHS.FORGOT_PASSWORD} 
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary mb-6 hover:gap-3 transition-all"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
        <h1 className="text-[32px] font-bold text-[#101828]">Verify OTP</h1>
        <p className="text-[#475467] mt-2">
          Enter the 6-digit code sent to <span className="font-semibold text-[#101828] text-nowrap">{email || 'your email'}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={verifyOtpInitValues}
          validationSchema={verifyOtpValidateSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, isSubmitting }) => (
            <Form className="flex flex-col">
              <FormInput
                label="Enter OTP"
                name="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={values.otp}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.otp && errors.otp}
                placeholder="0 0 0 0 0 0"
                icon={<ShieldCheck size={20} />}
                size="text-2xl tracking-[0.5rem] text-center font-bold"
              />

              <div className="flex items-center justify-center gap-2 mt-4 mb-6">
                 <p className="text-sm text-[#475467]">Didn't receive code?</p>
                 <button
                   type="button"
                   onClick={handleResend}
                   disabled={timer > 0 || isResending}
                   className={`text-sm font-bold ${ (timer > 0 || isResending) ? 'text-[#98A2B3] cursor-not-allowed' : 'text-primary hover:text-green-700'}`}
                 >
                   {isResending ? 'Sending...' : `Resend ${timer > 0 ? `(${timer}s)` : ''}`}
                 </button>
              </div>

              <Button
                type="submit"
                label="Verify Code"
                isLoading={isVerifying}
                disabled={!isValid || !dirty || isVerifying}
              />
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
