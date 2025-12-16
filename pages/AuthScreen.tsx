import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Button from '../components/Button';

const { width, height } = Dimensions.get('window');

const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true; // Prevent default back action
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  );

  const handleSignIn = () => {
    console.log('Sign In pressed');
    navigation.navigate('SignIn' as never);
  };

  const handleSignUp = () => {
    console.log('Sign Up pressed');
    navigation.navigate('SignUp' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      

      
      <View style={styles.content}>
        <View style={styles.headerSection}>
          {/* Top row with two half-width containers */}
          <View style={styles.topRow}>
            {/* Left half - single image */}
            <View style={styles.leftHalf}>
              <Image 
                source={require('../assets/signinup_top_right.png')}
                style={styles.imageStyle}
                resizeMode="cover"
              />
            </View>
            
            {/* Right half - two vertically stacked images */}
            <View style={styles.rightHalf}>
              <View style={styles.topRightImage}>
                <Image 
                  source={require('../assets/signinup_top_leftup.png')}
                  style={styles.faceImageStyle}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.bottomRightImage}>
                <Image 
                  source={require('../assets/signinup_top_leftdown.png')}
                  style={styles.imageStyle}
                  resizeMode="cover"
                />
              </View>
            </View>
          </View>
          
          {/* Bottom full width image */}
          <View style={styles.fullWidthImage}>
            <Image 
              source={require('../assets/main.png')}
              style={styles.imageStyle}
              resizeMode="cover"
            />
          </View>
        </View>

        <Text style={styles.loremText}>
          Lorem Ipsum - All the facts. Discover seamless learning with our comprehensive educational platform. Join thousands of students today.
        </Text>

        <View style={styles.buttonSection}>
          <Button
            title="Sign in"
            onPress={handleSignIn}
            variant="primary"
            style={styles.button}
            textStyle={styles.buttonText}
          />
          
          <Button
            title="Sign up"
            onPress={handleSignUp}
            variant="primary"
            style={styles.signUpButton}
            textStyle={styles.signUpText}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16423C',
  },

  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingTop: '8%',
    paddingBottom: '5%',
  },
  headerSection: {
    flex: 0.6,
    justifyContent: 'center',
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
    flex: 0.5,
    minHeight: 120,
    maxHeight: 200,
  },
  leftHalf: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightHalf: {
    flex: 1,
    gap: 10,
  },
  topRightImage: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bottomRightImage: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthImage: {
    width: '100%',
    flex: 0.5,
    minHeight: 150,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  faceImageStyle: {
    width: '100%',
    height: 270,
    borderRadius: 12,
    marginTop: -30,
  },
  loremText: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: width * 0.045,
    lineHeight: width * 0.055,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    flex: 0.25,
    paddingVertical: '3%',
    minHeight: 60,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 15,
    flex: 0.15,
    alignItems: 'flex-end',
    paddingBottom: '8%',
  },
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.08,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
  signUpButton: {
    flex: 1,
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.08,
    borderRadius: 8,
    backgroundColor: '#3E5F44',
    alignItems: 'center',
    minHeight: 48,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AuthScreen;