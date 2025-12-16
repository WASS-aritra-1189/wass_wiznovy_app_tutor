import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import TutorCard from '../components/TutorCard';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Footer from '../components/Footer';

interface CategorySubjectsPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const BANNER_IMAGES = [
  require('../assets/categorymain.png'),
  require('../assets/categorymain.png'),
  require('../assets/categorymain.png'),
];

// Mock data - move this to route params or props
const MOCK_TUTORS = [
  { id: '1', image: '', title: 'Math', expertCount: '10' },
  { id: '2', image: '', title: 'Science', expertCount: '8' },
  { id: '3', image: '', title: 'English', expertCount: '12' },
  { id: '4', image: '', title: 'History', expertCount: '5' },
  { id: '5', image: '', title: 'Geography', expertCount: '7' },
  { id: '6', image: '', title: 'Physics', expertCount: '9' },
  { id: '7', image: '', title: 'Chemistry', expertCount: '6' },
  { id: '8', image: '', title: 'Biology', expertCount: '8' },
  { id: '9', image: '', title: 'Art', expertCount: '4' },
];

const CategorySubjectsPage: React.FC<CategorySubjectsPageProps> = ({
  navigation,
  route,
  onBack,
}) => {
  // Get data from route params or use mock data
  const tutors = route?.params?.tutors || MOCK_TUTORS;
  const categoryMainImage = route?.params?.categoryMainImage;

  const handleTutorPress = useCallback((tutorTitle: string) => {
    navigation.navigate('SubjectTeachersPage', {
      subjectTitle: tutorTitle,
    });
  }, [navigation]);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const imageWidth = screenWidth - 40;

  // Optimized auto-scroll with cleanup
  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout;

    if (isMounted) {
      intervalId = setInterval(() => {
        setCurrentIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % BANNER_IMAGES.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * imageWidth,
            animated: true,
          });
          return nextIndex;
        });
      }, 5000);
    }

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [imageWidth]);

  // Direct navigation handlers - no complex nesting
  const handleHomePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Home' });
  }, [navigation]);

  const handleProfilePress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Profile' });
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('MainTabs', { screen: 'Search' });
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      navigation.goBack();
    }
  }, [navigation, onBack]);

  // Memoized banner component
  const bannerComponent = useMemo(() => (
    <View style={styles.categoryBannerContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.bannerScrollView}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
          setCurrentIndex(newIndex);
        }}
      >
        {BANNER_IMAGES.map((image, index) => (
          <Image 
            key={index}
            source={image} 
            style={[styles.categoryImage, { width: imageWidth }]}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      <View style={styles.paginationOverlay}>
        <View style={styles.paginationContainer}>
          {BANNER_IMAGES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  ), [imageWidth, currentIndex]);

  // Memoized tutor rows
  const tutorRows = useMemo(() => {
    const renderTutorRow = (slice: typeof tutors, isLastRow = false) => (
      <View style={[styles.tutorsRow, isLastRow && styles.lastRow]}>
        {slice.map((tutor: any) => (
          <View key={tutor.id} style={styles.tutorCardWrapper}>
            <TutorCard
              image={tutor.image}
              title={tutor.title}
              expertCount={tutor.expertCount}
              onPress={() => handleTutorPress(tutor.title)}
            />
          </View>
        ))}
      </View>
    );

    return (
      <View style={styles.contentContainer}>
        <View style={styles.tutorsContainer}>
          {renderTutorRow(tutors.slice(0, 3))}
        </View>
        {bannerComponent}
        <View style={styles.tutorsContainer}>
          {renderTutorRow(tutors.slice(3, 6))}
          {renderTutorRow(tutors.slice(6, 9), true)}
        </View>
      </View>
    );
  }, [tutors, bannerComponent, handleTutorPress]);

  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.headerText}>My Categories</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
        >
          {tutorRows}
        </ScrollView>
        
        <Footer 
          onHomePress={handleHomePress}
          onProfilePress={handleProfilePress}
          onSearchPress={handleSearchPress}
        />
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

// ... styles remain the same ...
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  categoryBannerContainer: {
    paddingHorizontal: 20,
    marginVertical: 25,
    alignItems: 'center',
    position: 'relative',
  },
  bannerScrollView: {
    height: 191,
  },
  categoryImage: {
    width: '100%',
    height: 191,
    borderRadius: 12,
    marginRight: 0,
    backgroundColor: '#f0f0f0',
  },
  paginationOverlay: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    width: 50,
    height: 18,
    borderRadius: 13.5,
    borderWidth: 0.41,
    borderColor: '#01004C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  paginationDot: {
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#01004C',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#01004C',
    width: 5.48,
    height: 5.48,
    borderRadius: 2.74,
    borderWidth: 1,
    borderColor: '#01004C',
  },
  tutorsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tutorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingHorizontal: 0,
  },
  lastRow: {
    marginBottom: 10,
  },
  tutorCardWrapper: {
    alignItems: 'center',
    flex: 1,
    maxWidth: '33.33%',
  },
});

export default React.memo(CategorySubjectsPage);