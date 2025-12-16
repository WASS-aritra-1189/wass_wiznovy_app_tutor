import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface StudyMaterialCardProps {
  id: string;
  title: string;
  description: string;
  fileUrl?: string | null;
  filePath?: string | null;
  createdAt: string;
  onPress?: () => void;
  onDownload?: () => void;
}

const StudyMaterialCard: React.FC<StudyMaterialCardProps> = ({
  id,
  title,
  description,
  fileUrl,
  filePath,
  createdAt,
  onPress,
  onDownload
}) => {
  const getFileIcon = () => {
    if (!fileUrl) return 'description';
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture-as-pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'ppt':
      case 'pptx':
        return 'slideshow';
      default:
        return 'insert-drive-file';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={getFileIcon()} size={40} color="#16423C" />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.fileInfo}>
            {fileUrl ? fileUrl.split('.').pop()?.toUpperCase() || 'FILE' : 'TEXT'} • {formatDate(createdAt)}
          </Text>
          {fileUrl && (
            <Text style={styles.downloadCount}>Has attachment</Text>
          )}
        </View>
      </View>
      
      {fileUrl && (
        <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
          <MaterialIcons name="download" size={24} color="#16423C" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F0F8F0',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
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
  fileInfo: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
  downloadCount: {
    fontSize: 12,
    color: '#999999',
  },
  downloadButton: {
    padding: 8,
  },
});

export default StudyMaterialCard;