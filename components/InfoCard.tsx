import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface InfoCardProps {
  image: any;
  title: string;
  subtitle: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ image, title, subtitle }) => {
  return (
    <View style={styles.infoCard}>
      <View style={styles.imageSection}>
        <Image 
          source={image} 
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textSection}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.arrowButton}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    flex: 1,
    height: 200,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F3F7FF',
    padding: 8,
    position: 'relative',
    marginRight: 0,
  },
  imageSection: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardImage: {
    width: 45,
    height: 45,
  },
  textSection: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  titleText: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18,
    letterSpacing: 0,
    color: '#01004C',
    marginBottom: 12,
  },
  subtitleText: {
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#01004C',
  },
  arrowButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 12,
    color: '#01004C',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
    includeFontPadding: false,
  },
});

export default InfoCard;