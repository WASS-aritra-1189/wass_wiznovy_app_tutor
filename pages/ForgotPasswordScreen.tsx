import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import TermsPopup from '../components/TermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { forgotPassword } from '../services/authService';

interface ForgotPasswordScreenProps {
  onBack?: () => void;
  onResetPassword?: (email: string) => void;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onShowTermsPopup?: (callback: () => void) => void;
  onOtpVerification?: (email: string) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onResetPassword,
  onSignIn,
  onSignUp,
  onShowTermsPopup,
  onOtpVerification,
}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showTermsConditionsPopup, setShowTermsConditionsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPostSuccessTerms, setShowPostSuccessTerms] = useState(false);

  const handleResetPassword = async () => {
    console.log('🚀 [FORGOT PASSWORD SCREEN] Reset password button clicked');
    console.log('📧 [FORGOT PASSWORD SCREEN] Email input:', email);
    
    if (!email.trim()) {
      console.log('❌ [FORGOT PASSWORD SCREEN] Email validation failed - empty email');
      setErrorMessage('Please enter your email address');
      setShowErrorPopup(true);
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      
      setErrorMessage('Please enter a valid email address');
      setShowErrorPopup(true);
      return;
    }
    
    
     
    setLoading(true);
    try {
      const result = await forgotPassword({ email });
      console.log('📊 [FORGOT PASSWORD SCREEN] API result:', result);
      
      if (result.success) {
        console.log('✅ [FORGOT PASSWORD SCREEN] API call successful, showing success popup');
        setShowSuccessPopup(true);
      } else {
        console.log('❌ [FORGOT PASSWORD SCREEN] API call failed:', result.message);
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('💥 [FORGOT PASSWORD SCREEN] Unexpected error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      console.log('🏁 [FORGOT PASSWORD SCREEN] API call completed, setting loading to false');
      setLoading(false);
    }
  };

  const handleAcceptTerms = () => {
    setShowPopup(false);
    onResetPassword?.(email);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleShowTermsPopup = (callback: () => void) => {
    setShowTermsConditionsPopup(true);
    // Store the callback to execute when terms are accepted
    (handleShowTermsPopup as any).callback = callback;
  };

  const handleTermsAccept = () => {
    setShowTermsConditionsPopup(false);
    // Execute the stored callback
    if ((handleShowTermsPopup as any).callback) {
      (handleShowTermsPopup as any).callback();
    }
  };

  const handleTermsClose = () => {
    setShowTermsConditionsPopup(false);
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
          <Text style={styles.backText}>Forgot password</Text>
        </TouchableOpacity>
        <View />
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
          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your email address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Please enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  const filteredText = text.replaceAll(/[^a-zA-Z0-9@.]/g, '');
                  setEmail(filteredText);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Divider */}
          {/* <View style={styles.divider} /> */}

          {/* Reset Password Button */}
          <Button
            title={loading ? "Sending..." : "Reset Password"}
            onPress={handleResetPassword}
            variant="primary"
            style={StyleSheet.flatten([styles.resetButton, loading && styles.buttonDisabled])}
            textStyle={styles.resetButtonText}
            disabled={loading}
          />

          {/* Sign In Link */}
          <TouchableOpacity onPress={onSignIn} style={styles.signInLink}>
            <Text style={styles.signInText}>Remember your password? </Text>
            <Text style={styles.signInLinkText}>sign in.</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={onSignUp}>
            <Text style={styles.signUpLink}>Sign up now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TermsPopup
        visible={showPopup}
        onAccept={handleAcceptTerms}
        onCancel={handleClosePopup}
        onShowTermsPopup={handleShowTermsPopup}
      />
      
      <TermsConditionsPopup
        visible={showTermsConditionsPopup}
        onAccept={handleTermsAccept}
        onClose={handleTermsClose}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Password reset email sent successfully"
        onClose={() => setShowSuccessPopup(false)}
        onShowTerms={() => setShowPostSuccessTerms(true)}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
      
      <TermsPopup
        visible={showPostSuccessTerms}
        onAccept={() => {
          setShowPostSuccessTerms(false);
          // Navigate to OTP verification screen
          (navigation as any).navigate('OtpVerification', { email, type: 'forgot-password' });
        }}
        onDecline={() => {
          setShowPostSuccessTerms(false);
        }}
        onOtpRedirect={() => {
          setShowPostSuccessTerms(false);
          (navigation as any).navigate('OtpVerification', { email, type: 'forgot-password' });
        }}
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
    color: '#10004C',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
  appSubtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
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
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  // divider: {
  //   height: 1,
  //   backgroundColor: '#E0E0E0',
  //   marginVertical: 30,
  // },
  resetButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signInLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
    color: '#01004C',
  },
  signInLinkText: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
    marginTop: 400,
  },
  signUpText: {
    fontSize: 14,
    color: '#01004C',
  },
  signUpLink: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default ForgotPasswordScreen;