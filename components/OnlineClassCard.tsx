import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface OnlineClassCardProps {
  count: number;
  label: string;
}

const OnlineClassCard: React.FC<OnlineClassCardProps> = ({ count, label }) => {
  return (
    <View style={styles.onlineClassCard}>
      <View style={styles.tutorImageSection}>
        <Image 
          source={require('../assets/tutorclass.png')} 
          style={styles.tutorClassImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.classInfoSection}>
        <Text style={styles.classCountText}>{count}</Text>
        <Text style={styles.classLabelText}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  onlineClassCard: {
    width: 194,
    height: 83,
    backgroundColor: '#D9D9D91A',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tutorImageSection: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#16423C',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    overflow: 'hidden',
  },
  tutorClassImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  classInfoSection: {
    flex: 1,
    paddingLeft: 12,
    justifyContent: 'center',
  },
  classCountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 4,
  },
  classLabelText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});

export default OnlineClassCard;