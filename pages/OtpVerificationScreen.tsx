import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../components/Button';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import OtpInput from '../components/OtpInput';
import { verifyOtp, verifyRegistration, forgotPassword } from '../services/authService';
import { storeToken, removeOnboardingStatus } from '../services/storage';

const OtpVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, type } = route.params as { email: string; type?: string };
  const isRegistration = type === 'registration';
  
  console.log('📝 [OTP VERIFICATION SCREEN] Component initialized');
  console.log('📧 [OTP VERIFICATION SCREEN] Email from route:', email);
  console.log('📝 [OTP VERIFICATION SCREEN] Type from route:', type);
  console.log('📝 [OTP VERIFICATION SCREEN] Is Registration:', isRegistration);
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerifyOtp = async () => {
    console.log('🚀 [OTP VERIFICATION SCREEN] Verify OTP button clicked');
    console.log('📧 [OTP VERIFICATION SCREEN] Email:', email);
    console.log('🔢 [OTP VERIFICATION SCREEN] OTP:', otp);
    console.log('📝 [OTP VERIFICATION SCREEN] Type:', type);
    console.log('📝 [OTP VERIFICATION SCREEN] Is Registration:', isRegistration);
    
    if (!otp.trim()) {
      console.log('❌ [OTP VERIFICATION SCREEN] OTP validation failed - empty OTP');
      setErrorMessage('Please enter the OTP');
      setShowErrorPopup(true);
      return;
    }

    if (otp.length !== 6) {
      console.log('❌ [OTP VERIFICATION SCREEN] OTP validation failed - invalid length:', otp.length);
      setErrorMessage('Please enter a valid 6-digit OTP');
      setShowErrorPopup(true);
      return;
    }

    console.log('✅ [OTP VERIFICATION SCREEN] OTP validation passed');
    console.log('🔄 [OTP VERIFICATION SCREEN] Starting API call...');
    
    setLoading(true);
    try {
      const result = isRegistration 
        ? await verifyRegistration({ email, otp })
        : await verifyOtp({ email, otp });
      
      console.log('📊 [OTP VERIFICATION SCREEN] API result:', result);
      
      if (result.success) {
        console.log('✅ [OTP VERIFICATION SCREEN] API call successful');
        
        // Store token for both registration and password reset
        if (result.data?.token) {
          console.log('🔑 [OTP VERIFICATION SCREEN] Token found in response, storing...');
          await storeToken(result.data.token);
          console.log('✅ [OTP VERIFICATION SCREEN] Token stored successfully for', isRegistration ? 'registration' : 'password reset');
          
          // For new registrations, ensure onboarding status is false
          if (isRegistration) {
            await removeOnboardingStatus();
            console.log('✅ [OTP VERIFICATION SCREEN] Onboarding status reset for new registration');
          }
        } else {
          console.log('⚠️ [OTP VERIFICATION SCREEN] No token found in response');
        }
        
        console.log('🎉 [OTP VERIFICATION SCREEN] Showing success popup');
        setShowSuccessPopup(true);
      } else {
        console.log('❌ [OTP VERIFICATION SCREEN] API call failed:', result.message);
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('💥 [OTP VERIFICATION SCREEN] Unexpected error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      console.log('🏁 [OTP VERIFICATION SCREEN] API call completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    console.log('🚀 [OTP VERIFICATION SCREEN] Resend OTP button clicked');
    console.log('📧 [OTP VERIFICATION SCREEN] Resending OTP for email:', email);
    
    setResendLoading(true);
    try {
      const result = await forgotPassword({ email });
      console.log('📊 [OTP VERIFICATION SCREEN] Resend OTP result:', result);
      
      if (result.success) {
        console.log('✅ [OTP VERIFICATION SCREEN] OTP resent successfully');
        setTimer(30);
        setCanResend(false);
        setOtp('');
        console.log('🔄 [OTP VERIFICATION SCREEN] Timer reset to 30, OTP field cleared');
      } else {
        console.log('❌ [OTP VERIFICATION SCREEN] Failed to resend OTP:', result.message);
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('💥 [OTP VERIFICATION SCREEN] Resend OTP error:', error);
      setErrorMessage('Failed to resend OTP. Please try again.');
      setShowErrorPopup(true);
    } finally {
      console.log('🏁 [OTP VERIFICATION SCREEN] Resend OTP completed, setting loading to false');
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
      
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#000" />
            <Text style={styles.backText}>Verify OTP</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* App Title Section */}
          <View style={styles.appTitleSection}>
            <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
            <Text style={styles.appTitle}>All the facts</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.instructionText}>
              We've sent a 6-digit verification code to {email}
            </Text>
            
            <View style={styles.timerContainer}>
              {canResend ? (
                <TouchableOpacity 
                  onPress={handleResendOtp}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>
                    {resendLoading ? 'Sending...' : 'Resend OTP'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.timerText}>
                  Resend OTP in {timer} seconds
                </Text>
              )}
            </View>

            {/* OTP Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Enter OTP</Text>
              <OtpInput
                length={6}
                value={otp}
                onOtpChange={setOtp}
              />
            </View>

            {/* Verify Button */}
            <Button
              title={loading ? "Verifying..." : "Verify OTP"}
              onPress={handleVerifyOtp}
              variant="primary"
              style={StyleSheet.flatten([styles.verifyButton, loading && styles.buttonDisabled])}
              textStyle={styles.verifyButtonText}
              disabled={loading}
            />
          </View>
        </ScrollView>

        <SuccessPopup
          visible={showSuccessPopup}
          message="OTP verified successfully"
          onClose={() => {
            console.log('📝 [OTP VERIFICATION SCREEN] Success popup closed');
            console.log('📝 [OTP VERIFICATION SCREEN] Navigation decision - isRegistration:', isRegistration);
            
            setShowSuccessPopup(false);
            if (isRegistration) {
              console.log('📍 [OTP VERIFICATION SCREEN] Navigating to Onboarding for registration');
              (navigation as any).navigate('Onboarding');
            } else {
              console.log('📍 [OTP VERIFICATION SCREEN] Navigating to ResetPassword for forgot password flow');
              console.log('📧 [OTP VERIFICATION SCREEN] Passing email to ResetPassword:', email);
              (navigation as any).navigate('ResetPassword', { email });
            }
          }}
        />
        
        <ErrorPopup
          visible={showErrorPopup}
          message={errorMessage}
          onClose={() => setShowErrorPopup(false)}
        />
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#01004C',
    marginLeft: 4,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    marginBottom: 8,
  },

  verifyButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default OtpVerificationScreen;