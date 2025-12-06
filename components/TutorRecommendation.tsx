import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

const TutorRecommendation: React.FC = () => {
  const tutors = [
    {
      id: 1,
      name: 'Mr. Alabar Anthoney',
      subject: 'SPANISH LANGUAGE',
      rating: 4.8,
      sessions: '4 PH',
      groupTuition: true,
      privateTuition: true,
    },
    {
      id: 2,
      name: 'John Smith',
      subject: 'Mathematics',
      rating: 4.7,
      sessions: '3 PH',
      groupTuition: true,
      privateTuition: true,
    },
    {
      id: 3,
      name: 'Sarah Johnson',
      subject: 'English Literature',
      rating: 4.9,
      sessions: '5 PH',
      groupTuition: true,
      privateTuition: true,
    },
  ];

  return (
    <View style={styles.recommendationContainer}>
      <View style={styles.recommendationHeader}>
        <Text style={styles.recommendationTitle}>Tutor Recommendation</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tutorSlider}>
        {tutors.map((tutor) => (
          <TouchableOpacity key={tutor.id} style={styles.tutorCard}>
            <View style={styles.tutorContent}>
              <View style={styles.tutorImageContainer}>
                <Image 
                  source={require('../assets/tutor.png')} 
                  style={styles.tutorImage}
                  resizeMode="cover"
                />
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.tutorInfo}>
                <View style={styles.tutorNameRow}>
                  <Text style={styles.tutorName}>{tutor.name}</Text>
                  <Image 
                    source={require('../assets/tutor badge.png')} 
                    style={styles.tutorBadge}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.tutorSubject}>Specialized in: {tutor.subject}</Text>
                
                <View style={styles.ratingSessionRow}>
                  <View style={styles.sessionContainer}>
                    <Image 
                      source={require('../assets/dollar.png')} 
                      style={styles.dollarIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.sessionText}>{tutor.sessions}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingText}>★{tutor.rating}</Text>
                  </View>
                </View>

                <View style={styles.tuitionTypeRow}>
                  {tutor.groupTuition && (
                    <View style={styles.tuitionType}>
                      <Text style={styles.tuitionTypeText}>Group Tuition</Text>
                    </View>
                  )}
                  {tutor.privateTuition && (
                    <View style={styles.tuitionType}>
                      <Text style={styles.tuitionTypeText}>Private Tuition</Text>
                    </View>
                  )}
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
  recommendationContainer: {
    paddingHorizontal: 20,
    marginBottom: 5,
    
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationTitle: {
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
  tutorSlider: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tutorCard: {
    backgroundColor: '#F2FFFA',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    marginBottom: 8,
    width: 294,
    height: 114,
    elevation: 4,
    shadowColor: '#888585ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
    
  },
  tutorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  tutorImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  tutorImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  onlineDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0AAD2D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tutorInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  tutorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  tutorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'left',
  },
  tutorBadge: {
    width: 16,
    height: 16,
  },
  tutorSubject: {
    fontSize: 10,
    color: '#01004C',
    marginBottom: 4,
    textAlign: 'left',
  },
  ratingSessionRow: {
    flexDirection: 'row',
    marginBottom: 4,
    gap: 6,
  },
  sessionContainer: {
    backgroundColor: '#E8F4F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    minWidth: 40,
    borderWidth: .41,
    borderColor: '#01004C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  dollarIcon: {
    width: 8,
    height: 8,
  },
  sessionText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#16423C',
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 25,
    minWidth: 40,
    borderWidth: .41,
    borderColor: '#01004C',
  },
  ratingText: {
    fontSize: 8,
    fontWeight: '500',
    color: '#E6B301',
  },
  tuitionTypeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  tuitionType: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#B9B9B9',
  },
  tuitionTypeText: {
    fontSize: 8,
    fontWeight: '400',
    color: '#666',
  },
});

export default TutorRecommendation;