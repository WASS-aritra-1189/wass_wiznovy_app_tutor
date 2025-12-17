import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import GoogleLoginTermsPopup from '../components/GoogleLoginTermsPopup';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';

import { registerUser } from '../services/authService';
import { storeToken } from '../services/storage';
import { validateSignUpForm, clearFieldError } from '../utils/authUtils';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleTermsPopup, setShowGoogleTermsPopup] = useState(false);
  const [showAppleTermsPopup, setShowAppleTermsPopup] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{name?: string; phone?: string; email?: string; password?: string; confirmPassword?: string; terms?: string}>({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const handleSignUp = async () => {
    const newErrors = validateSignUpForm(name, phone, email, password, confirmPassword, acceptTerms);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const result = await registerUser({
          name,
          phoneNumber: phone,
          email,
          password,
        });
         
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
        console.error('Sign up error:', error);
        setErrorMessage('Something went wrong. Please try again.');
        setShowErrorPopup(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    setShowGoogleTermsPopup(true);
  };

  const handleGoogleTermsContinue = () => {
    setShowGoogleTermsPopup(false);
    console.log('Google sign up accepted');
  };

  const handleAppleSignUp = () => {
    setShowAppleTermsPopup(true);
  };

  const handleAppleTermsContinue = () => {
    setShowAppleTermsPopup(false);
    console.log('Apple sign up accepted');
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
          <Text style={styles.backText}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      


      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollViewContent}
        >
        {/* App Title Section */}
        <View style={styles.appTitleSection}>
          <Text style={styles.appTitle}>Lipsum generator: Lorem Ipsum -</Text>
          <Text style={styles.appTitle}>All the facts</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Please enter your name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.name && styles.inputError]}
                placeholder="Please enter your name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={(text) => {
                  const filteredText = text.replaceAll(/[^a-zA-Z\s]/g, '');
                  setName(filteredText);
                  clearFieldError(errors, 'name', setErrors);
                }}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Phone Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Your phone number</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="phone" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.phone && styles.inputError]}
                placeholder="Please enter your phone number"
                placeholderTextColor="#999"
                value={phone}
                onChangeText={(text) => {
                  const numericText = text.replaceAll(/\D/g, '');
                  if (numericText.length <= 10) {
                    setPhone(numericText);
                    clearFieldError(errors, 'phone', setErrors);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

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
                placeholder="Please enter your password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setPassword(text);
                    clearFieldError(errors, 'password', setErrors);
                    if (errors.confirmPassword && confirmPassword && text === confirmPassword) {
                      clearFieldError(errors, 'confirmPassword', setErrors);
                    }
                  }
                }}
                maxLength={10}
                secureTextEntry={false}
                textContentType="none"
                autoComplete="off"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm your password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#999" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputWithIcon, errors.confirmPassword && styles.inputError]}
                placeholder="Please confirm your password"
                placeholderTextColor="#999"
                value={confirmPassword}
                onChangeText={(text) => {
                  if (text.length <= 10) {
                    setConfirmPassword(text);
                    clearFieldError(errors, 'confirmPassword', setErrors);
                  }
                }}
                maxLength={10}
                secureTextEntry={false}
                textContentType="none"
                autoComplete="off"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <MaterialIcons 
                  name={showConfirmPassword ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsSection}>
            <View style={styles.termsContainer}>
              <TouchableOpacity 
                onPress={() => setAcceptTerms(!acceptTerms)}
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
          </View>

          {/* Sign Up Button */}
          <Button
            title={loading ? "Signing up..." : "Sign up"}
            onPress={handleSignUp}
            variant="primary"
            style={StyleSheet.flatten([styles.signUpButton, loading && styles.buttonDisabled])}
            textStyle={styles.signUpButtonText}
            disabled={loading}
          />
        </View>

        {/* Social Login Section */}
        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Sign up with social media</Text>
          
          <View style={styles.socialButtons}>
            <TouchableOpacity onPress={handleGoogleSignUp} style={styles.socialButton}>
              <Image 
                source={require('../assets/google.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleAppleSignUp} style={styles.socialButton}>
              <Image 
                source={require('../assets/apple.png')} 
                style={styles.socialIcon}
                resizeMode="contain"
              />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn' as never)}>
            <Text style={styles.signInLink}>Sign in now</Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <GoogleLoginTermsPopup
        visible={showGoogleTermsPopup}
        onContinue={handleGoogleTermsContinue}
        action="signup"
      />
      
      <GoogleLoginTermsPopup
        visible={showAppleTermsPopup}
        onContinue={handleAppleTermsContinue}
        provider="apple"
        action="signup"
      />
      
      <TermsConditionsPopup
        visible={showTermsPopup}
        onAccept={handleTermsAccept}
        onClose={() => setShowTermsPopup(false)}
      />
      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Registration successful! Please verify your email."
        onClose={() => {
          setShowSuccessPopup(false);
          (navigation as any).navigate('OtpVerification', { email, type: 'registration' });
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 50,
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
  appSubtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'left',
  },
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
    color: '#01004C',
  },
  termsSection: {
    marginBottom: 25,
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
  signUpButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
  },
  signUpButtonText: {
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: '#01004C',
  },
  signInLink: {
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
  },
  socialIcon: {
    width: 13,
    height: 13,
    opacity: 1,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default SignUpScreen;