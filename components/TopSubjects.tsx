import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const TopSubjects: React.FC = () => {
  return (
    <View style={styles.subjectsContainer}>
      <View style={styles.subjectsHeader}>
        <Text style={styles.subjectsTitle}>Top Subjects</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsGrid}>
        <TouchableOpacity style={styles.subjectItem} activeOpacity={0.7}>
          <View style={styles.subjectIconContainer}>
            <Image 
              source={require('../assets/mathematics.png')} 
              style={styles.subjectIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subjectText}>Mathematics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.subjectItem} activeOpacity={0.7}>
          <View style={styles.subjectIconContainer}>
            <Image 
              source={require('../assets/english.png')} 
              style={styles.subjectIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subjectText}>English</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.subjectItem} activeOpacity={0.7}>
          <View style={styles.subjectIconContainer}>
            <Image 
              source={require('../assets/history.png')} 
              style={styles.subjectIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subjectText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.subjectItem} activeOpacity={0.7}>
          <View style={styles.subjectIconContainer}>
            <Image 
              source={require('../assets/spanish.png')} 
              style={styles.subjectIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.subjectText}>Spanish</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  subjectsContainer: {
    backgroundColor: '#F2FFFA',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#918d8dff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
  },
  subjectsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  subjectsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  viewAllButton: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0,
    color: '#16423C',
  },
  subjectsGrid: {
    flexDirection: 'row',
  },
  subjectItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  subjectIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#000',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  subjectIcon: {
    width: 50,
    height: 50,
  },
  subjectText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default TopSubjects;