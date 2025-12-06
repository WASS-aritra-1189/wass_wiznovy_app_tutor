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

export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/tutor/register`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('name', userData.name);
    formData.append('phoneNumber', userData.phoneNumber);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/tutor/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Registration successful',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Registration failed',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const loginUser = async (userData: LoginUserData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/tutor/login`);
    console.log('Request data:', userData);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    
    const response = await fetch(`${API_BASE_URL}/auth/tutor/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);

    if (response.ok) {
      console.log('Login successful, full response:', data);
      return {
        success: true,
        message: data.message || 'Login successful',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const logoutUser = async (): Promise<AuthResponse> => {
  try {
    console.log('=== Logout API Started ===');
    
    const token = await getToken();
    console.log('Token for logout:', token ? 'Token exists' : 'No token found');
    
    if (!token) {
      console.log('⚠️ No token found, treating as successful logout');
      return {
        success: true,
        message: 'Logout successful (no token)',
        data: null,
      };
    }
    
    const apiUrl = `${API_BASE_URL}/auth/logout`;
    console.log('Logout API URL:', apiUrl);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    
    console.log('Request headers:', headers);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
    });

    console.log('Logout response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Logout successful, response data:', data);
      return {
        success: true,
        message: data.message || 'Logout successful',
        data: data,
      };
    } else if (response.status === 401) {
      console.log('⚠️ 401 Unauthorized - token already invalid');
      return {
        success: true,
        message: 'Logout successful (token was invalid)',
        data: null,
      };
    } else {
      const data = await response.json();
      console.log('❌ Logout failed, response data:', data);
      return {
        success: false,
        message: data.message || 'Logout failed',
      };
    }
    
  } catch (error) {
    console.error('❌ Logout API Error:', error);
    return {
      success: false,
      message: `Logout failed: ${error}`,
    };
  }
};

export const forgotPassword = async (userData: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    console.log('🔄 [FORGOT PASSWORD] Starting forgot password request');
    console.log('📧 [FORGOT PASSWORD] Email:', userData.email);
    console.log('🌐 [FORGOT PASSWORD] API URL:', `${API_BASE_URL}/auth/forgotPass`);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('role', "TUTOR");
    
    console.log('📝 [FORGOT PASSWORD] Form data:', formData.toString());
    
    const response = await fetch(`${API_BASE_URL}/auth/forgotPass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('📊 [FORGOT PASSWORD] Response status:', response.status);
    console.log('📊 [FORGOT PASSWORD] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 [FORGOT PASSWORD] Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ [FORGOT PASSWORD] Parsed response data:', data);
    } catch (parseError) {
      console.error('❌ [FORGOT PASSWORD] Failed to parse JSON:', parseError);
      return {
        success: false,
        message: 'Invalid response format from server',
      };
    }

    if (response.ok) {
      console.log('✅ [FORGOT PASSWORD] Request successful');
      return {
        success: true,
        message: data.message || 'OTP sent to email successfully',
        data: data,
      };
    } else {
      console.log('❌ [FORGOT PASSWORD] Request failed');
      return {
        success: false,
        message: data.message || 'Failed to send password reset email',
      };
    }
  } catch (error) {
    console.error('💥 [FORGOT PASSWORD] Network/API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const verifyOtp = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    console.log('🔄 [VERIFY OTP] Starting OTP verification for forgot password');
    console.log('📧 [VERIFY OTP] Email:', userData.email);
    console.log('🔢 [VERIFY OTP] OTP:', userData.otp);
    
    // For forgot password flow, we should use a different endpoint
    const apiUrl = `${API_BASE_URL}/auth/verify-otp`;
    console.log('🌐 [VERIFY OTP] API URL:', apiUrl);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    formData.append('role', 'TUTOR');
    
    console.log('📝 [VERIFY OTP] Form data:', formData.toString());
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('📊 [VERIFY OTP] Response status:', response.status);
    console.log('📊 [VERIFY OTP] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 [VERIFY OTP] Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ [VERIFY OTP] Parsed response data:', data);
    } catch (parseError) {
      console.error('❌ [VERIFY OTP] Failed to parse JSON:', parseError);
      return {
        success: false,
        message: 'Invalid response format from server',
      };
    }

    if (response.ok) {
      console.log('✅ [VERIFY OTP] OTP verification successful');
      return {
        success: true,
        message: data.message || 'OTP verified successfully',
        data: data,
      };
    } else {
      console.log('❌ [VERIFY OTP] OTP verification failed');
      return {
        success: false,
        message: data.message || 'Invalid OTP',
      };
    }
  } catch (error) {
    console.error('💥 [VERIFY OTP] Network/API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const resetPassword = async (userData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    console.log('🔄 [RESET PASSWORD] Starting password reset');
    console.log('📧 [RESET PASSWORD] Email:', userData.email);
    console.log('🔐 [RESET PASSWORD] New password length:', userData.newPassword.length);
    
    const apiUrl = `${API_BASE_URL}/auth/resetPass`;
    console.log('🌐 [RESET PASSWORD] API URL:', apiUrl);
    
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('newPassword', userData.newPassword);
    formData.append('role', 'TUTOR');
    
    console.log('📝 [RESET PASSWORD] Form data (without password):', {
      email: userData.email,
      role: 'TUTOR',
      passwordLength: userData.newPassword.length
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    console.log('📊 [RESET PASSWORD] Response status:', response.status);
    console.log('📊 [RESET PASSWORD] Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 [RESET PASSWORD] Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ [RESET PASSWORD] Parsed response data:', data);
    } catch (parseError) {
      console.error('❌ [RESET PASSWORD] Failed to parse JSON:', parseError);
      return {
        success: false,
        message: 'Invalid response format from server',
      };
    }

    if (response.ok) {
      console.log('✅ [RESET PASSWORD] Password reset successful');
      return {
        success: true,
        message: data.message || 'Password reset successfully',
        data: data,
      };
    } else {
      console.log('❌ [RESET PASSWORD] Password reset failed');
      return {
        success: false,
        message: data.message || 'Failed to reset password',
      };
    }
  } catch (error) {
    console.error('💥 [RESET PASSWORD] Network/API Error:', error);
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};

export const verifyRegistration = async (userData: VerifyOtpData): Promise<AuthResponse> => {
  try {
    console.log('API URL:', `${API_BASE_URL}/auth/tutor/verify-registration`);
    const formData = new URLSearchParams();
    formData.append('email', userData.email);
    formData.append('otp', userData.otp);
    
    const response = await fetch(`${API_BASE_URL}/auth/tutor/verify-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: formData.toString(),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registration verification successful, full response:', data);
      return {
        success: true,
        message: data.message || 'Registration verified successfully',
        data: data,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to verify registration',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: `Network error: ${error}`,
    };
  }
};