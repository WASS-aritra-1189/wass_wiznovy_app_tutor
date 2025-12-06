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

export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/register`;
    console.log('API URL:', url);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await makeRequest(url, formData);
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    return handleResponse(response, data, 'Registration successful', 'Registration failed');
  } catch (error) {
    return handleError(error, 'API');
  }
};

export const loginUser = async (userData: LoginUserData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/login`;
    console.log('API URL:', url);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await makeRequest(url, formData);
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    if (response.ok) console.log('Login successful, full response:', data);

    return handleResponse(response, data, 'Login successful', 'Login failed');
  } catch (error) {
    return handleError(error, 'API');
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    console.log('=== Logout API Started ===');
    
    const token = await getToken();
    console.log('Token for logout:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      console.log('⚠️ No token found, treating as successful logout');
      return { success: true, message: 'Logout successful (no token)', data: null };
    }
    
    const url = `${API_BASE_URL}/auth/logout`;
    console.log('Logout API URL:', url);
    
    const response = await makeRequest(url, new URLSearchParams(), token);
    console.log('Logout response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Logout successful, response data:', data);
      return { success: true, message: data.message || 'Logout successful', data };
    }
    if (response.status === 401) {
      console.log('⚠️ 401 Unauthorized - token already invalid');
      return { success: true, message: 'Logout successful (token was invalid)', data: null };
    }
    const data = await response.json();
    console.log('❌ Logout failed, response data:', data);
    return { success: false, message: data.message || 'Logout failed' };
  } catch (error) {
    return handleError(error, '❌ Logout API');
  }
};

export const forgotPassword = async (userData: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/forgotPass`;
    console.log('🔄 [FORGOT PASSWORD] Starting forgot password request');
    console.log('📧 [FORGOT PASSWORD] Email:', userData.email);
    console.log('🌐 [FORGOT PASSWORD] API URL:', url);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('role', "TUTOR");
    console.log('📝 [FORGOT PASSWORD] Form data:', formData.toString());
    
    const response = await makeRequest(url, formData);
    console.log('📊 [FORGOT PASSWORD] Response status:', response.status);
    console.log('📊 [FORGOT PASSWORD] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await parseResponse(response);
    console.log('✅ [FORGOT PASSWORD] Parsed response data:', data);
    
    if (response.ok) console.log('✅ [FORGOT PASSWORD] Request successful');
    else console.log('❌ [FORGOT PASSWORD] Request failed');
    
    return handleResponse(response, data, 'OTP sent to email successfully', 'Failed to send password reset email');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      console.error('❌ [FORGOT PASSWORD] Failed to parse JSON:', error);
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [FORGOT PASSWORD] Network/API');
  }
};

export const verifyOtp = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/verify-otp`;
    console.log('🔄 [VERIFY OTP] Starting OTP verification for forgot password');
    console.log('📧 [VERIFY OTP] Email:', userData.email);
    console.log('🔢 [VERIFY OTP] OTP:', userData.otp);
    console.log('🌐 [VERIFY OTP] API URL:', url);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    formData.append('role', 'TUTOR');
    console.log('📝 [VERIFY OTP] Form data:', formData.toString());
    
    const response = await makeRequest(url, formData);
    console.log('📊 [VERIFY OTP] Response status:', response.status);
    console.log('📊 [VERIFY OTP] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await parseResponse(response);
    console.log('✅ [VERIFY OTP] Parsed response data:', data);
    
    if (response.ok) console.log('✅ [VERIFY OTP] OTP verification successful');
    else console.log('❌ [VERIFY OTP] OTP verification failed');
    
    return handleResponse(response, data, 'OTP verified successfully', 'Invalid OTP');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      console.error('❌ [VERIFY OTP] Failed to parse JSON:', error);
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [VERIFY OTP] Network/API');
  }
};

export const resetPassword = async (userData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/resetPass`;
    console.log('🔄 [RESET PASSWORD] Starting password reset');
    console.log('📧 [RESET PASSWORD] Email:', userData.email);
    console.log('🔐 [RESET PASSWORD] New password length:', userData.newPassword.length);
    console.log('🌐 [RESET PASSWORD] API URL:', url);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('newPassword', userData.newPassword);
    formData.append('role', 'TUTOR');
    console.log('📝 [RESET PASSWORD] Form data (without password):', {
      email: userData.email,
      role: 'TUTOR',
      passwordLength: userData.newPassword.length
    });
    
    const response = await makeRequest(url, formData);
    console.log('📊 [RESET PASSWORD] Response status:', response.status);
    console.log('📊 [RESET PASSWORD] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await parseResponse(response);
    console.log('✅ [RESET PASSWORD] Parsed response data:', data);
    
    if (response.ok) console.log('✅ [RESET PASSWORD] Password reset successful');
    else console.log('❌ [RESET PASSWORD] Password reset failed');
    
    return handleResponse(response, data, 'Password reset successfully', 'Failed to reset password');
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid response format from server') {
      console.error('❌ [RESET PASSWORD] Failed to parse JSON:', error);
      return { success: false, message: error.message };
    }
    return handleError(error, '💥 [RESET PASSWORD] Network/API');
  }
};

export const verifyRegistration = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    const url = `${API_BASE_URL}/auth/tutor/verify-registration`;
    console.log('API URL:', url);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    
    const response = await makeRequest(url, formData);
    const data = await response.json();
    if (response.ok) console.log('Registration verification successful, full response:', data);

    return handleResponse(response, data, 'Registration verified successfully', 'Failed to verify registration');
  } catch (error) {
    return handleError(error, 'API');
  }
};