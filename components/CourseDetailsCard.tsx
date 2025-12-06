import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

interface CourseDetailsCardProps {
  image: any;
  authorName: string;
  expertise: string;
}

const CourseDetailsCard: React.FC<CourseDetailsCardProps> = ({
  image,
  authorName,
  expertise,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Image source={image} style={styles.courseImage} resizeMode="cover" />
        <View style={styles.rightContent}>
          <Text style={styles.authorName}>{authorName}</Text>
          <Text style={styles.expertise}>{expertise}</Text>
        </View>
      </View>
      <Text style={styles.description}>
        Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.
      </Text>
      <View style={styles.separator} />
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/coursestartdate.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Start Date</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/faqcourse.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>FAQ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/receipt.png')} style={styles.buttonIcon} resizeMode="contain" />
          <Text style={styles.buttonText}>Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    marginHorizontal: 4,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  rightContent: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  expertise: {
    fontSize: 14,
    fontWeight: '500',
    color: '#01004C',
    marginBottom: 8,
    paddingTop: 20,
  },
  description: {
    fontSize: 12,
    color: '#01004C',
    lineHeight: 16,
    marginBottom: 16,
    paddingTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    height: 32,
    backgroundColor: '#E7E7E7',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DFDFDF',
    borderWidth: 1,
    paddingHorizontal: 8,
    gap: 4,
  },
  buttonIcon: {
    width: 12,
    height: 12,
  },
  buttonText: {
    fontSize: 12,
    color: '#01004C',
    fontWeight: '400',
  },
  separator: {
    height: 1,
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
});

export default CourseDetailsCard;