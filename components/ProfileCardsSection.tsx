import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomCard from './CustomCard';

const ProfileCardsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>For your Reviews</Text>
      <View style={styles.row}>
        <CustomCard 
          imageSource={require('../assets/profilefaq.png')}
          text="FAQ'S"
        />
        <CustomCard 
          imageSource={require('../assets/profilerefer.png')}
          text="Refer a Friend"
        />
        <CustomCard 
          imageSource={require('../assets/profileprivacy.png')}
          text="Privacy policy"
        />
      </View>
      <View style={styles.row}>
        <CustomCard 
          imageSource={require('../assets/profilerate.png')}
          text="Rating & Reviews"
        />
        <CustomCard 
          imageSource={require('../assets/profilehelp.png')}
          text="Help & Support"
        />
        <CustomCard 
          imageSource={require('../assets/profileterms.png')}
          text="Terms & Conditions"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 396,
    height: 286,
    marginTop: 20,
    marginLeft: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#01004C',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
});

export default ProfileCardsSection;