import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import CourseCard from '../components/CourseCard';
import VideoCard from '../components/VideoCard';

interface VideoDetailsPageProps {
  navigation: any;
  route: any;
}

const VideoDetailsPage: React.FC<VideoDetailsPageProps> = ({ navigation, route }) => {
  const { course } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleVideoPress = (video: any) => {
    navigation.navigate('CourseVideoPage', { video });
  };

  const sampleVideos = [
    {
      id: 1,
      title: 'Introduction to Course',
      description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      duration: '15 min',
      chapter: 'Chapter 1',
      videoNumber: '2 Video ',
      isWatched: true,
    },
    {
      id: 2,
      title: 'Getting Started',
      description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      duration: '22 min',
      chapter: 'Chapter 1',
      videoNumber: '3 Video',
      isWatched: true,
    },
    {
      id: 3,
      title: 'Advanced Concepts',
      description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      duration: '18 min',
      chapter: 'Chapter 2',
      videoNumber: '4 Video',
      isWatched: false,
    },
    {
      id: 4,
      title: 'Practical Examples',
      description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      duration: '25 min',
      chapter: 'Chapter 2',
      videoNumber: '5 Video',
      isWatched: false,
    },
    {
      id: 5,
      title: 'Final Project',
      description: 'Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.',
      duration: '30 min',
      chapter: 'Chapter 3',
      videoNumber: '6 Video',
      isWatched: false,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#ffffff" />
          <Text style={styles.backText}>Course Videos</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.courseCardWrapper}>
          <CourseCard
            image={course.image}
            title={course.title}
            description={course.description}
            duration={course.duration}
            language={course.language}
            price={course.price}
            totalVideos={course.totalVideos}
            rating={course.rating}
          />
        </View>
        
        {sampleVideos.map((video) => (
          <VideoCard
            key={video.id}
            title={video.title}
            description={video.description}
            duration={video.duration}
            chapter={video.chapter}
            videoNumber={video.videoNumber}
            isWatched={video.isWatched}
            onPress={() => handleVideoPress(video)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#16423C',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    flex: 1,
  },
  backText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 0,
    flex: 1,
  },
  headerPlaceholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 50,
  },
  courseCardWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
});

export default VideoDetailsPage;