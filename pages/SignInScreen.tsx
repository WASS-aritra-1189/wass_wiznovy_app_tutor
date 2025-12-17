import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import GoogleLoginTermsPopup from '../components/GoogleLoginTermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import { useNavigationContext } from '../navigation/NavigationContext';
import { loginUser } from '../services/authService';
import { storeToken } from '../services/storage';
import { validateSignInForm, clearFieldError } from '../utils/authUtils';

const SignInScreen: React.FC = () => {
  const navigation = useNavigation();
  const { onAuthSuccess } = useNavigationContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showGoogleTermsPopup, setShowGoogleTermsPopup] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string; terms?: string}>({});
  const [showAppleTermsPopup, setShowAppleTermsPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');




  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    try {
      const result = await loginUser({ email: loginEmail, password: loginPassword });
      
      if (result.success) {
        if (result.data?.token) {
          await storeToken(result.data.token);
        }
        setShowSuccessPopup(true);
      } else {
        setErrorMessage(result.message);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    const newErrors = validateSignInForm(email, password, acceptTerms);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await performLogin(email, password);
    }
  };

  const handleGoogleSignIn = () => {
    setShowGoogleTermsPopup(true);
  };

  const handleGoogleTermsContinue = () => {
    setShowGoogleTermsPopup(false);
    console.log('Google sign in accepted');
  };

  const handleAppleSignIn = () => {
    setShowAppleTermsPopup(true);
  };

  const handleAppleTermsContinue = () => {
    setShowAppleTermsPopup(false);
    console.log('Apple sign in accepted');
  };

  const handleTermsAccept = () => {
    setAcceptTerms(true);
    setShowTermsPopup(false);
    clearFieldError(errors, 'terms', setErrors);
  };

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#000" />
          <Text style={styles.backText}>Sign in</Text>
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
          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your email address</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.email && styles.inputError]}
                placeholder="Please enter your email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  const filteredText = text.replaceAll(/[^a-zA-Z0-9@.]/g, '');
                  setEmail(filteredText);
                  clearFieldError(errors, 'email', setErrors);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.password && styles.inputError]}
                placeholder="Please enter your Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError(errors, 'password', setErrors);
                }}
                secureTextEntry={false}
                textContentType="none"
                autoComplete="off"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as never)} style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
          </TouchableOpacity>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              onPress={() => {
                setAcceptTerms(!acceptTerms);
                clearFieldError(errors, 'terms', setErrors);
              }}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              console.log('Terms text pressed');
              setShowTermsPopup(true);
            }}>
              <Text style={styles.termsText}>I accept the terms and conditions of this app</Text>
            </TouchableOpacity>
          </View>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          {/* Sign In Button */}
          <Button
            title={loading ? "Signing in..." : "Sign in"}
            onPress={handleSignIn}
            variant="primary"
            style={StyleSheet.flatten([styles.signInButton, loading && styles.buttonDisabled])}
            textStyle={styles.signInButtonText}
            disabled={loading}
          />
        </View>

        {/* Social Login Section */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Login with social media</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity onPress={handleGoogleSignIn} style={styles.socialButton}>
              <Image 
                source={require('../assets/google.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleAppleSignIn} style={styles.socialButton}>
              <Image 
                source={require('../assets/apple.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
            <Text style={styles.signUpLink}>Sign up now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <GoogleLoginTermsPopup
        visible={showGoogleTermsPopup}
        onContinue={handleGoogleTermsContinue}
      />
      
      <GoogleLoginTermsPopup
        visible={showAppleTermsPopup}
        onContinue={handleAppleTermsContinue}
        provider="apple"
      />
      
      <TermsConditionsPopup
        visible={showTermsPopup}
        onAccept={handleTermsAccept}
        onClose={() => setShowTermsPopup(false)}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Login successful!"
        onClose={() => {
          setShowSuccessPopup(false);
          onAuthSuccess();
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
    paddingTop: 60,
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
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  appTitleSection: {
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 4,
  },
  // appSubtitle: {
  //   fontSize: 16,
  //   color: '#000',
  //   textAlign: 'left',
  // },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 25,
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
    color: '#000000',
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#01004C',
    fontSize: 14,
    // fontStyle: 'italic',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#01004C',
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#01004C',
  },
  termsText: {
    fontSize: 14,
    color: '#01004C',
    flex: 1,
  },
  signInButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  socialSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  socialButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  socialIcon: {
    width: 13,
    height: 13,
    opacity: 1,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 80,
    marginTop: 200,
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
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default SignInScreen;