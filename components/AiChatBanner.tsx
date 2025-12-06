import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AiChatBanner: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.bannerContainer}>
        <LinearGradient
          colors={['#03A9F4', '#31BD80']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.mainText}>Ask anything to AI Chat</Text>
              <Text style={styles.subText}>
                Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/robot.png')} 
                style={styles.robotImage}
                resizeMode="contain"
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bannerContainer: {
    width: '100%',
    height: 83,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    overflow: 'hidden',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  mainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 16,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotImage: {
    width: 50,
    height: 50,
  },
});

export default AiChatBanner;