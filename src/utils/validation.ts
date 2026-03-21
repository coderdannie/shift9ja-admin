import * as Yup from 'yup';

export const loginInitValues = {
  email: '',
  password: '',
  rememberMe: false,
};

export const loginValidateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
});

// Change Password (Profile Settings)
export const changePassInitValues = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export const changePassValidateSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Forgot Password
export const forgotPassInitValues = {
  email: '',
};

export const forgotPassValidateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

// Verify OTP (4 digits)
export const verifyOtpInitValues = {
  otp: '',
};

export const verifyOtpValidateSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^[0-9]+$/, 'Must be only numbers')
    .required('OTP is required'),
});

// Reset Password
export const resetPassInitValues = {
  password: '',
  confirmPassword: '',
};

export const resetPassValidateSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

// Invite Admin
export const inviteAdminInitValues = {
  firstName: '',
  lastName: '',
  email: '',
  roleId: '',
};

export const inviteAdminValidateSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('First name is required'),
  lastName: Yup.string()
    .required('Last name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  roleId: Yup.string()
    .required('Role is required'),
});

// Accept Invitation
export const acceptInviteInitValues = {
  email: '',
  token: '',
  password: '',
  confirmPassword: '',
};

export const acceptInviteValidateSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  token: Yup.string()
    .length(6, 'OTP must be 6 digits')
    .matches(/^[0-9]+$/, 'Must be only numbers')
    .required('OTP is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});
