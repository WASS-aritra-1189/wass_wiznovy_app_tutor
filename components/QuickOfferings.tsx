import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const QuickOfferings: React.FC = () => {
  return (
    <View style={styles.offeringsContainer}>
      <Text style={styles.offeringsTitle}>Quick Offerings</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offeringsGrid}>
        <TouchableOpacity style={styles.offeringItem}>
          <View style={styles.findTutorIconContainer}>
            <Image 
              source={require('../assets/findtutor.png')} 
              style={styles.largeOfferingIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offeringText}>Find Tutor</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.offeringItem}>
          <View style={styles.offeringIconContainer}>
            <Image 
              source={require('../assets/liveclass.png')} 
              style={styles.largeOfferingIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offeringText}>Live Class</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.offeringItem}>
          <View style={styles.offeringIconContainer}>
            <Image 
              source={require('../assets/schedule.png')} 
              style={styles.offeringIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offeringText}>Schedule</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.offeringItem}>
          <View style={styles.offeringIconContainer}>
            <Image 
              source={require('../assets/library.png')} 
              style={styles.offeringIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.offeringText}>Open Library</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  offeringsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  offeringsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  offeringsGrid: {
    flexDirection: 'row',
  },
  offeringItem: {
    alignItems:'center',
    marginRight: 20,
    width: 80,
  },
  offeringIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
  },
  findTutorIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16423C',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  offeringIcon: {
    width: 60,
    height: 60,
  },
  largeOfferingIcon: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: -10,
  },
  // offeringIconn: {
  //   width: 80,
  //   height: 80,
  // },
  offeringText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickOfferings;