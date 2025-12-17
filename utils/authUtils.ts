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

export const clearFieldError = (
  errors: Record<string, string | undefined>,
  field: string,
  setErrors: (fn: (prev: Record<string, string | undefined>) => Record<string, string | undefined>) => void
) => {
  if (errors[field]) {
    setErrors(prev => ({...prev, [field]: undefined}));
  }
};