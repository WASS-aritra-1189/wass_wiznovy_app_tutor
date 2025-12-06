import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface WalletCardProps {
  amount: number;
  text:string;
  type?: string;
  imageSource?: any;
  onPress?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ amount,text,type,imageSource,onPress }) => {
  return (
    <TouchableOpacity style={styles.walletCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.leftSection}>
        <View style={styles.purseImageSection}>
          <Image 
            source={imageSource || require('../assets/tutorpurse.png')} 
            style={styles.purseImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.amountSection}>
          <Text style={styles.amountText}>{type}{amount}</Text>
          <Text style={styles.earningText}>{text}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.arrowButton}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  walletCard: {
    width: 397,
    height: 83,
    backgroundColor: '#16423C',
    borderWidth: 1,
    borderColor: '#16423C',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purseImageSection: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ECECEC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  purseImage: {
    width: 30,
    height: 30,
  },
  amountSection: {
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  earningText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 2,
  },
  arrowButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    
    borderRadius: 25,
  },
  arrowText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
});

export default WalletCard;