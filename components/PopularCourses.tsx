import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const PopularCourses: React.FC = () => {
  const courses = [
    {
      id: 1,
      title: 'English Grammar course',
      class: 'Class 10',
      sessions: '10 Session',
      duration: '5h 45 Min',
      price: '299',
      rating: 4.8,
      image: require('../assets/courses.png'),
    },
    {
      id: 2,
      title: 'English Grammar',
      class: 'Class 10',
      sessions: '10 Session',
      duration: '5h 45 Min',
      price: '199',
      rating: 4.8,
      image: require('../assets/courses.png'),
    },
    {
      id: 3,
      title: 'English Grammar',
      class: 'Class 10',
      sessions: '10 Session',
      duration: '5h 45 Min',
      price: '399',
      rating: 4.8,
      image: require('../assets/courses.png'),
    },
  ];

  return (
    <View style={styles.coursesContainer}>
      <View style={styles.coursesHeader}>
        <Text style={styles.coursesTitle}>Popular Course</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesSlider}>
        {courses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <View style={styles.courseImageContainer}>
              <Image 
                source={course.image} 
                style={styles.courseImage}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.reactionButton}>
                <Image 
                  source={require('../assets/reaction.png')} 
                  style={styles.reactionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseSubtitle}>{course.class} ({course.sessions})</Text>
              
              <View style={styles.detailsRow}>
                <View style={styles.detailItemContainer}>
                  <View style={styles.durationContainer}>
                    <Image 
                      source={require('../assets/clock.png')} 
                      style={styles.clockIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.durationText}>{course.duration}</Text>
                  </View>
                </View>
                <View style={styles.detailItemContainer}>
                  <View style={styles.priceContainer}>
                    <Image 
                      source={require('../assets/dollarforcourse.png')} 
                      style={styles.dollarCourseIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.priceText}>{course.price}</Text>
                  </View>
                </View>
                <View style={styles.ratingItemContainer}>
                  <View style={styles.ratingContainer}>
                    <Image 
                      source={require('../assets/imageforratingincoursecard.png')} 
                      style={styles.ratingIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.ratingText}>{course.rating}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  coursesContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: -5,
  },
  coursesTitle: {
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
  coursesSlider: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 15,
    width: 250,
    borderWidth: 1,
    borderColor: '#D3CDCD',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#c4c1c1ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
  },
  courseImageContainer: {
    width: '100%',
    height: 130,
    padding: 8,
    position: 'relative',
  },
  courseImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  reactionButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#F2FFFA',
    borderRadius: 15,
    padding: 6,
  },
  reactionIcon: {
    width: 18,
    height: 18,
  },
  courseInfo: {
    padding: 12,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'#01004C',
    marginBottom: 4,
  },
  courseSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  detailItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 25,
    borderColor:'#16423C',
    borderWidth: .41,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarCourseIcon: {
    width: 10,
    height: 10,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    
    
  },
  clockIcon: {
    width: 10,
    height: 10,
  },
  ratingItemContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  durationText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C', // Green color for duration
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#16423C', // Same color as duration
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingIcon: {
    width: 10,
    height: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000000',
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
});

export default PopularCourses;