import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface CustomCardProps {
  imageSource: any;
  text: string;
}

const CustomCard: React.FC<CustomCardProps> = ({ imageSource, text }) => {
  return (
    <View style={styles.card}>
      <Image 
        source={imageSource}
        style={styles.cardImage}
        resizeMode="contain"
      />
      <Text style={styles.cardText}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 105,
    height: 90,
    paddingTop: 17,
    paddingRight: 16,
    paddingBottom: 17,
    paddingLeft: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F4F2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 30,
    height: 30,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 12,
    color: '#333333',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CustomCard;