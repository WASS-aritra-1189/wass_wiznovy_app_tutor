import { VALIDATION_MESSAGES } from '../constants/validationMessages';

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};

export const validateSignInForm = (email: string, password: string, acceptTerms: boolean) => {
  const errors: {email?: string; password?: string; terms?: string} = {};
  
  if (!email.trim()) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!validateEmail(email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }
  
  if (!password.trim()) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!validatePassword(password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH;
  }
  
  if (!acceptTerms) {
    errors.terms = VALIDATION_MESSAGES.TERMS_REQUIRED;
  }
  
  return errors;
};

export const validateName = (name: string) => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replaceAll(/\D/g, ''));
};

export const validateSignUpPassword = (password: string) => {
  return password.length >= 6 && password.length <= 10;
};

export const validateSignUpForm = (
  name: string,
  phone: string,
  email: string,
  password: string,
  confirmPassword: string,
  acceptTerms: boolean
) => {
  const errors: Record<string, string> = {};
  
  if (!name.trim()) {
    errors.name = VALIDATION_MESSAGES.NAME_REQUIRED;
  } else if (!validateName(name)) {
    errors.name = VALIDATION_MESSAGES.NAME_INVALID;
  }
  
  if (!phone.trim()) {
    errors.phone = VALIDATION_MESSAGES.PHONE_REQUIRED;
  } else if (!validatePhone(phone)) {
    errors.phone = VALIDATION_MESSAGES.PHONE_INVALID;
  }
  
  if (!email.trim()) {
    errors.email = VALIDATION_MESSAGES.EMAIL_REQUIRED;
  } else if (!validateEmail(email)) {
    errors.email = VALIDATION_MESSAGES.EMAIL_INVALID;
  }
  
  if (!password.trim()) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_REQUIRED;
  } else if (!validateSignUpPassword(password)) {
    errors.password = VALIDATION_MESSAGES.PASSWORD_SIGNUP_LENGTH;
  }
  
  if (!confirmPassword.trim()) {
    errors.confirmPassword = VALIDATION_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = VALIDATION_MESSAGES.PASSWORDS_NOT_MATCH;
  }
  
  if (!acceptTerms) {
    errors.terms = VALIDATION_MESSAGES.TERMS_REQUIRED;
  }
  
  return errors;
};

export const clearFieldError = (
  errors: Record<string, string | undefined>,
  field: string,
  setErrors: (fn: (prev: Record<string, string | undefined>) => Record<string, string | undefined>) => void
) => {
  if (errors[field]) {
    setErrors(prev => ({...prev, [field]: undefined}));
  }
};