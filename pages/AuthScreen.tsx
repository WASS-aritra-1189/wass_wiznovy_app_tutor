import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
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
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerSection: {
    marginTop: 40,
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
    height: 200,
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
    height: 381,
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
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#FFFFFF',
    marginVertical: 30,
    flex: 1,
  },
  buttonSection: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  signUpButton: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 32,
    borderRadius: 8,
    backgroundColor: '#3E5F44',
    alignItems: 'center',
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AuthScreen;