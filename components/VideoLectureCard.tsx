import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface VideoLectureCardProps {
  title: string;
  description: string;
  duration: string;
  thumbnail?: any;
  viewCount?: number;
  isWatched?: boolean;
  onPress?: () => void;
}

const VideoLectureCard: React.FC<VideoLectureCardProps> = ({
  title,
  description,
  duration,
  thumbnail,
  viewCount = 0,
  isWatched = false,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.thumbnailContainer}>
        <Image 
          source={thumbnail || require('../assets/videoplay.png')} 
          style={styles.thumbnail}
        />
        <View style={styles.playOverlay}>
          <MaterialIcons name="play-circle-filled" size={40} color="rgba(255,255,255,0.9)" />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
        {isWatched && (
          <View style={styles.watchedBadge}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
          </View>
        )}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.viewCount}>{viewCount} views</Text>
          <Text style={styles.status}>{isWatched ? 'Watched' : 'Not watched'}</Text>
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
    marginVertical: 6,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    height: 120,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  watchedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCount: {
    fontSize: 12,
    color: '#999999',
  },
  status: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
});

export default VideoLectureCard;