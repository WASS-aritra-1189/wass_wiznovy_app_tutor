import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface UnitCardProps {
  courseName: string;
  unitName: string;
  totalVideos: number;
  totalMaterials: number;
  subject: string;
  duration: string;
  unitImage?: any;
  onPress?: () => void;
  onEdit?: () => void;
  unitId?: string;
}

const UnitCard: React.FC<UnitCardProps> = ({
  courseName,
  unitName,
  totalVideos,
  totalMaterials,
  subject,
  duration,
  unitImage,
  onPress,
  onEdit
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image 
          source={unitImage || require('../assets/coursefinalimage.png')} 
          style={styles.unitImage}
        />
        {onEdit && (
          <TouchableOpacity style={styles.editButton} onPress={onEdit}>
            <MaterialIcons name="edit" size={16} color="#16423C" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.courseName}>{courseName}</Text>
        <Text style={styles.unitName}>{unitName}</Text>
        <Text style={styles.subject}>{subject}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="play-circle-outline" size={16} color="#666666" />
            <Text style={styles.statText}>{totalVideos} Videos</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="description" size={16} color="#666666" />
            <Text style={styles.statText}>{totalMaterials} Materials</Text>
          </View>
          
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={16} color="#666666" />
            <Text style={styles.statText}>{duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  unitImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  courseName: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  unitName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  subject: {
    fontSize: 14,
    color: '#16423C',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default UnitCard;