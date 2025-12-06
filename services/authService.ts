import { API_BASE_URL } from '../config/baseUrl';
import { getToken } from './storage';

interface RegisterUserData {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
}

interface LoginUserData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

const makeRequest = async (
  url: string,
  body: URLSearchParams,
  token?: string
): Promise<Response> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  return fetch(url, {
    method: 'POST',
    headers,
    body: body.toString(),
  });
};

const parseResponse = async (response: Response): Promise<any> => {
  const responseText = await response.text();
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error('Invalid response format from server');
  }
};

const handleResponse = (
  response: Response,
  data: any,
  successMsg: string,
  failMsg: string
): AuthResponse => {
  if (response.ok) {
    return {
      success: true,
      message: data.message || successMsg,
      data,
    };
  }
  return {
    success: false,
    message: data.message || failMsg,
  };
};

const handleError = (error: unknown, context: string): AuthResponse => {
  console.error(`${context} Error:`, error);
  return {
    success: false,
    message: `Network error: ${error}`,
  };
};

const logRequest = (prefix: string, url: string, data?: any) => {
  console.log(`${prefix} API URL:`, url);
  if (data) console.log(`${prefix} Request data:`, data);
};

const logResponse = (prefix: string, response: Response, data: any) => {
  console.log(`${prefix} Response status:`, response.status);
  console.log(`${prefix} Response data:`, data);
};

const executeRequest = async (
  url: string,
  formData: URLSearchParams,
  successMsg: string,
  failMsg: string,
  token?: string
): Promise<AuthResponse> => {
  const response = await makeRequest(url, formData, token);
  const data = await response.json();
  return handleResponse(response, data, successMsg, failMsg);
};

export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/register`;
    logRequest('', url, userData);
    
    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    return executeRequest(url, formData, 'Registration successful', 'Registration failed');
  } catch (error) {
    return handleError(error, 'API');
  }
};

export const loginUser = async (userData: LoginUserData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/login`;
    logRequest('', url, userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    return executeRequest(url, formData, 'Login successful', 'Login failed');
  } catch (error) {
    return handleError(error, 'API');
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    const token = await getToken();
    if (!token) return { success: true, message: 'Logout successful (no token)', data: null };
    
    const url = `${API_BASE_URL}/auth/logout`;
    const response = await makeRequest(url, new URLSearchParams(), token);
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, message: data.message || 'Logout successful', data };
    }
    if (response.status === 401) return { success: true, message: 'Logout successful (token was invalid)', data: null };
    
    const data = await response.json();
    return { success: false, message: data.message || 'Logout failed' };
  } catch (error) {
    return handleError(error, '❌ Logout API');
  }
};

export const forgotPassword = async (userData: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/forgotPass`;
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('role', "TUTOR");
    
    const response = await makeRequest(url, formData);
    const data = await parseResponse(response);
    return handleResponse(response, data, 'OTP sent to email successfully', 'Failed to send password reset email');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [FORGOT PASSWORD] Network/API');
  }
};

export const verifyOtp = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/verify-otp`;
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    formData.append('role', 'TUTOR');
    
    const response = await makeRequest(url, formData);
    const data = await parseResponse(response);
    return handleResponse(response, data, 'OTP verified successfully', 'Invalid OTP');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [VERIFY OTP] Network/API');
  }
};

export const resetPassword = async (userData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/resetPass`;
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('newPassword', userData.newPassword);
    formData.append('role', 'TUTOR');
    
    const response = await makeRequest(url, formData);
    const data = await parseResponse(response);
    return handleResponse(response, data, 'Password reset successfully', 'Failed to reset password');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [RESET PASSWORD] Network/API');
  }
};

export const verifyRegistration = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/verify-registration`;
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    
    return executeRequest(url, formData, 'Registration verified successfully', 'Failed to verify registration');
  } catch (error) {
    return handleError(error, 'API');
  }
};