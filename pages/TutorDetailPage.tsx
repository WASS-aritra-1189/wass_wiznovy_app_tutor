import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Footer from '../components/Footer';
import SubjectTutorCard from '../components/SubjectTutorCard';
import AboutAuthor from '../components/AboutAuthor';
import Speciality from '../components/Speciality';
import Availability from '../components/Availability';
import ReviewSection from '../components/ReviewSection';

interface TutorDetailPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const TutorDetailPage: React.FC<TutorDetailPageProps> = ({
  navigation,
  route,
  onBack,
}) => {
  const tutor = route?.params?.tutor;

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  const handleHomePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleBookTutor = useCallback(() => {
    // Handle book tutor functionality
    console.log('Book tutor pressed');
  }, []);

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.headerText}>Tutor Details</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Main Content Area */}
        <View style={styles.contentWrapper}>
          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentContainer}>
              {/* Tutor Card */}
              <View style={styles.section}>
                <SubjectTutorCard tutor={tutor} onPress={() => {}} />
              </View>

              {/* About Author */}
              <View style={styles.section}>
                <AboutAuthor 
                  authorName={tutor?.name || "Tutor Name"}
                  aboutText="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
                />
              </View>

              {/* Speciality */}
              <View style={styles.section}>
                <Speciality 
                  title="Speciality"
                  specialities={['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English']}
                />
              </View>

              {/* Availability */}
              <View style={styles.section}>
                <Availability />
              </View>

              {/* Reviews */}
              <View style={styles.section}>
                <ReviewSection title="Reviews" />
              </View>

              {/* Review Image */}
              <View style={styles.imageSection}>
                <Image 
                  source={require('../assets/reviewimage.png')} 
                  style={styles.reviewImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          </ScrollView>

          {/* Static Book Tutor Button */}
          <View style={styles.staticButtonContainer}>
            <TouchableOpacity style={styles.bookButton} onPress={handleBookTutor}>
              <Text style={styles.bookButtonText}>Book a Tutor</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Footer 
          onHomePress={handleHomePress}
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
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
    paddingTop: 40,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingLeft: 0,
    paddingRight: 4,
  },
  headerText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 32,
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Space for the static button
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  imageSection: {
    marginBottom: 20,
  },
  reviewImage: {
    width: 388,
    height: 200,
    borderRadius: 6,
  },
  // Static Button Styles
  staticButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // borderTopWidth: 1,
    // borderTopColor: '#E5E5E5',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: -2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 5,
  },
  bookButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(TutorDetailPage);