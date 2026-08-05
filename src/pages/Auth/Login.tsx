import React from "react";
import { motion } from "framer-motion";
import { Form, Formik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { Check } from "lucide-react";
import FormInput from "../../components/common/FormInput";
import Button from "../../components/common/Button";
import { loginInitValues, loginValidateSchema } from "../../utils/validation";
import { PUBLIC_PATHS, PRIVATE_PATHS } from "../../routes/constants";

import { useLoginAdmin } from "../../services/query/auth";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useLoginAdmin({
    onSuccess: (response: any) => {
      if (response.success) {
        toast.success(response.message || "Login Successful!");
        // Store both user data and accessToken
        const userData = {
          ...response.data,
          accessToken: response.accessToken,
        };
        sessionStorage.setItem("user", JSON.stringify(userData));

        // Navigation after successful login
        setTimeout(() => {
          navigate(PRIVATE_PATHS.DASHBOARD);
        }, 1000);
      } else {
        toast.error(response.message || "Login failed");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  const handleSubmit = (values: typeof loginInitValues) => {
    login({
      email: values.email,
      password: values.password,
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
        <h1 className="text-[32px] font-bold text-[#101828]">Log in</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Formik
          initialValues={loginInitValues}
          validationSchema={loginValidateSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isValid,
            dirty,
            isSubmitting,
          }) => (
            <Form className="flex flex-col">
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter email"
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && errors.password}
                placeholder="Enter password"
              />

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={values.rememberMe}
                      onChange={(e) =>
                        setFieldValue("rememberMe", e.target.checked)
                      }
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#D0D5DD] bg-white transition-all checked:border-primary checked:bg-primary"
                    />
                    <Check
                      className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
                      strokeWidth={3}
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium text-[#475467] cursor-pointer"
                  >
                    Keep me logged in
                  </label>
                </div>
                <Link
                  to={PUBLIC_PATHS.FORGOT_PASSWORD}
                  className="text-sm font-semibold text-primary hover:text-green-700 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                label="Log in"
                isLoading={isLoggingIn}
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

export default Login;
