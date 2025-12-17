import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { AppDispatch} from '../store/store';
import { clearUser, fetchUserProfile } from '../store/userSlice';
import { getToken, removeToken} from '../services/storage';
import { logoutUser } from '../services/authService';

// Auth screens
import SplashScreen from '../pages/SplashScreen';
import WalkthroughScreen from '../pages/WalkthroughScreen';
import AuthScreen from '../pages/AuthScreen';
import SignInScreen from '../pages/SignInScreen';
import SignUpScreen from '../pages/SignUpScreen';
import ForgotPasswordScreen from '../pages/ForgotPasswordScreen';
import OtpVerificationScreen from '../pages/OtpVerificationScreen';
import ResetPasswordScreen from '../pages/ResetPasswordScreen';
import OnboardingFlow from '../pages/OnboardingFlow';

// Main app
import MainTabNavigator from './MainTabNavigator';
import { NavigationProvider } from './NavigationContext';

const Stack = createStackNavigator();

// Optimized Auth Stack - Components handle their own navigation
const AuthStack = ({ onAuthSuccess }: { onAuthSuccess: () => void }) => {
  return (
    <NavigationProvider onAuthSuccess={onAuthSuccess}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen name="Splash">
          {(props: any) => <SplashScreen {...props} onComplete={() => props.navigation.replace('Walkthrough')} />}
        </Stack.Screen>
        <Stack.Screen name="Walkthrough">
          {(props: any) => <WalkthroughScreen {...props} onComplete={() => props.navigation.replace('Auth')} onSkip={() => props.navigation.replace('Auth')} />}
        </Stack.Screen>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OtpVerification">
          {(props: any) => <OtpVerificationScreen {...props} email={props.route?.params?.email || ''} />}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {(props: any) => <ResetPasswordScreen {...props} email={props.route?.params?.email || ''} />}
        </Stack.Screen>
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      </Stack.Navigator>
    </NavigationProvider>
  );
};

// Main App - Simple tab navigator only
const MainApp = ({ onLogout }: { onLogout: () => void }) => {
  return <MainTabNavigator onLogout={onLogout} />;
};

// Main AppNavigator Component
const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    // Uncomment to reset app flow for testing
    // clearAllData();
    
    const checkAuthStatus = async () => {
      try {
        const token = await getToken();
        if (token) {
          await dispatch(fetchUserProfile()).unwrap();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
        await removeToken();
        setIsAuthenticated(false);
      } finally {
        setIsInitialized(true);
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  // Handle successful authentication
  const handleAuthSuccess = async () => {
    console.log('=== handleAuthSuccess called ===');
    try {
      const token = await getToken();
      console.log('Token from storage:', token ? 'EXISTS' : 'NOT FOUND');
      if (token) {
        console.log('Fetching user profile after authentication...');
        const profileResult = await dispatch(fetchUserProfile()).unwrap();
        console.log('Profile fetch completed successfully:', profileResult ? 'SUCCESS' : 'FAILED');
        console.log('Setting authenticated to true after profile fetch');
        setIsAuthenticated(true);
      } else {
        console.log('No token found - cannot fetch profile');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('Auth success error:', error);
      console.log('Profile fetch failed, but setting authenticated anyway');
      setIsAuthenticated(true); // Still authenticate even if profile fetch fails
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API first
      const logoutResult = await logoutUser();
      console.log('Logout API result:', logoutResult);
      
      // Remove token and clear user data regardless of API result
      await removeToken();
      dispatch(clearUser());
      setIsAuthenticated(false);
    } catch (error) {
      console.log('Logout error:', error);
      // Still remove token and clear data even if API fails
      await removeToken();
      dispatch(clearUser());
      setIsAuthenticated(false);
    }
  };

  // Show loading screen while checking auth status
  if (!isInitialized) {
    return <SplashScreen onComplete={() => {}} />;
  }

  // Render appropriate stack based on auth status
  return isAuthenticated ? (
    <MainApp onLogout={handleLogout} />
  ) : (
    <AuthStack onAuthSuccess={handleAuthSuccess} />
  );
};

export default AppNavigator;