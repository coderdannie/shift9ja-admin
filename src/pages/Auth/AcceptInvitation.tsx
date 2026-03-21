import React from 'react';
import { motion } from 'framer-motion';
import { Form, Formik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Mail, Key } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { acceptInviteInitValues, acceptInviteValidateSchema } from '../../utils/validation';
import { PUBLIC_PATHS } from '../../routes/constants';
import { useAcceptInvitation } from '../../services/query/auth';

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  
  const { mutate: acceptInvite, isPending } = useAcceptInvitation();

  const handleSubmit = (values: typeof acceptInviteInitValues) => {
    acceptInvite(values, {
      onSuccess: () => {
        toast.success('Invitation accepted successfully! You can now login.');
        setTimeout(() => {
          navigate(PUBLIC_PATHS.LOGIN);
        }, 2000);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to accept invitation');
      }
    });
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
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4 border border-primary/20">
          Admin Invitation
        </span>
        <h1 className="text-[32px] font-bold text-[#101828]">Setup Account</h1>
        <p className="text-[#475467] mt-2 leading-relaxed">Enter your OTP and set a new password to activate your admin account.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={{
            ...acceptInviteInitValues,
            email: emailParam
          }}
          validationSchema={acceptInviteValidateSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, handleChange, handleBlur, isValid, dirty }) => (
            <Form className="flex flex-col gap-4">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter your email"
                icon={<Mail size={20} />}
                disabled={!!emailParam}
              />

              <FormInput
                label="OTP Token"
                name="token"
                type="text"
                value={values.token}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.token && errors.token}
                placeholder="Enter 6-digit OTP"
                icon={<Key size={20} />}
              />
              
              <FormInput
                label="New Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                placeholder="Create secure password"
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
                placeholder="Repeat new password"
                icon={<Lock size={20} />}
              />

              <Button
                type="submit"
                label="Activate Account"
                isLoading={isPending}
                disabled={!isValid || !dirty}
                className="mt-6 font-bold shadow-md shadow-primary/20 !h-12"
              />
            </Form>
          )}
        </Formik>
      </motion.div>
    </div>
  );
};

export default AcceptInvitation;
