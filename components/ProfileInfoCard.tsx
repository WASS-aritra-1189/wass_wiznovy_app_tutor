import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProfileInfoCardProps {
  imageSource: any;
  name: string;
  completionPercentage: number;
  title: string;
  subtitle: string;
  onUpdatePress?: () => void;
  isLoading?: boolean;
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ 
  imageSource, 
  name, 
  completionPercentage, 
  title, 
  subtitle,
  onUpdatePress,
  isLoading = false
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image 
          source={imageSource}
          style={styles.profileImage}
          resizeMode="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {name}
          </Text>
          <Text style={styles.completion}>
            {completionPercentage}% Profile Completed
          </Text>
        </View>
      </View>
      
      <Text style={styles.title}>
        {title}
      </Text>
      
      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
      
      <View style={styles.buttonSection}>
        <View style={styles.imageButtons}>
          <View style={styles.buttonWithLabel}>
            <TouchableOpacity style={styles.imageButton}>
              <Image source={require('../assets/subject.png')} style={styles.buttonIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Subject</Text>
          </View>
          
          <View style={styles.buttonWithLabel}>
            <TouchableOpacity style={styles.imageButton}>
              <Image source={require('../assets/days.png')} style={styles.buttonIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Availability</Text>
          </View>
          
          <View style={styles.buttonWithLabel}>
            <TouchableOpacity style={styles.imageButton}>
              <Image source={require('../assets/tutorrprofileating.png')} style={styles.buttonIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Rating</Text>
          </View>
          
          <View style={styles.buttonWithLabel}>
            <TouchableOpacity style={styles.imageButton}>
              <Image source={require('../assets/tutorexperiance.png')} style={styles.buttonIcon} resizeMode="contain" />
            </TouchableOpacity>
            <Text style={styles.buttonLabel}>Experience</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={onUpdatePress}
        >
          <Text style={styles.editButtonText}>
            {isLoading ? 'Updating...' : 'Update'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#090101ff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  completion: {
    fontSize: 14,
    color: '#666666',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  buttonSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageButton: {
    width: 49,
    height: 49,
    paddingTop: 8,
    paddingRight: 11,
    paddingBottom: 8,
    paddingLeft: 11,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
  },
  editButton: {
    width: 125,
    height: 49,
    borderRadius: 6,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginBottom: 18,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonWithLabel: {
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 10,
    color: '#666666',
    marginTop: 4,
  },
});

export default ProfileInfoCard;