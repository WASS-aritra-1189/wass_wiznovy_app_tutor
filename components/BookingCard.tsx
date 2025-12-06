import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface BookingCardProps {
  studentName: string;
  schedule: string;
  classBookedFor: string;
  studentImage?: any;
  date?: string;
  status?: string;
  price?: string;
  onPress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ 
  studentName, 
  schedule, 
  classBookedFor, 
  studentImage,
  date,
  status,
  price,
  onPress 
}) => {
  const getStatusBadgeStyle = () => {
    if (status === 'Ended') return styles.endedBadge;
    if (status === 'Ongoing') return styles.ongoingBadge;
    return styles.nextBadge;
  };

  const getStatusTextStyle = () => {
    if (status === 'Ended') return styles.endedText;
    if (status === 'Ongoing') return styles.ongoingText;
    return styles.nextText;
  };

  return (
    <TouchableOpacity style={styles.bookingCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Image 
          source={studentImage || require('../assets/studentimageforbooking.png')} 
          style={styles.studentImage}
          resizeMode="cover"
        />
        <View style={styles.textSection}>
          <Text style={styles.studentName}>{studentName}</Text>
          {date && <Text style={styles.date}>{date}</Text>}
          <View style={styles.scheduleClassRow}>
            <View style={styles.scheduleRow}>
              <Image 
                source={require('../assets/timing.png')} 
                style={styles.scheduleIcon}
                resizeMode="contain"
              />
              <Text style={styles.schedule}>{schedule}</Text>
            </View>
            <View style={styles.classRow}>
              <Image 
                source={require('../assets/class.png')} 
                style={styles.classIcon}
                resizeMode="contain"
              />
              <Text style={styles.classBookedFor}>{classBookedFor}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.rightSection}>
        <View style={styles.topRightSection}>
          {status && (
            <View style={[styles.statusBadge, getStatusBadgeStyle()]}>
              <Text style={[styles.statusText, getStatusTextStyle()]}>
                {status}
              </Text>
            </View>
          )}
          <Image 
            source={require('../assets/class1.png')} 
            style={styles.classImage}
            resizeMode="contain"
          />
          <Image 
            source={require('../assets/class2.png')} 
            style={styles.classImage}
            resizeMode="contain"
          />
        </View>
        {price && (
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    width: 390,
    height: 162,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    paddingTop: 5,
  },
  studentImage: {
    width: 60,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
    overflow: 'hidden',
    borderColor: '#01004C',
    borderWidth: 1,
    paddingTop: 40,
  },
  textSection: {
    flex: 1,
    paddingVertical: 5,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
    flexWrap: 'wrap',
    lineHeight: 18,
    marginTop: -10,
  },
  date: {
    fontSize: 11,
    color: '#16423C',
    fontWeight: '600',
    marginTop: -1,
  },
  scheduleClassRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  schedule: {
    fontSize: 12,
    color: '#666666',
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 30,
  },
  classIcon: {
    width: 12,
    height: 12,
    marginRight: 5,
  },
  classBookedFor: {
    fontSize: 12,
    color: '#666666',
  },
  rightSection: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingTop: 10,
  },
  topRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 5,
    marginTop: 10,
    marginRight: 10,
  },
  endedBadge: {
    backgroundColor: '#FF4444',
  },
  ongoingBadge: {
    backgroundColor: '#4CAF50',
  },
  nextBadge: {
    backgroundColor: '#2196F3',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  endedText: {
    color: '#FFFFFF',
  },
  ongoingText: {
    color: '#FFFFFF',
  },
  nextText: {
    color: '#FFFFFF',
  },
  classImage: {
    width: 30,
    height: 30,
    marginLeft: 5,
  },
  priceContainer: {
    backgroundColor: '#16423C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 30,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default BookingCard;