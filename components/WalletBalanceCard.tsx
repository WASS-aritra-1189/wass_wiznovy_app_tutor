import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface WalletBalanceCardProps {
  balance: number;
}

const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({ balance }) => {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={require('../assets/bank.png')} 
          style={styles.bankIcon}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.label}>Account Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>
            {isBalanceVisible ? `$${balance.toFixed(2)}` : '****'}
          </Text>
          <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.eyeButton}>
            <MaterialIcons 
              name={isBalanceVisible ? 'visibility' : 'visibility-off'} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  leftSection: {
    marginRight: 15,
  },
  bankIcon: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  rightSection: {
    flex: 1,
  },
  label: {
    color: '#CCCCCC',
    fontSize: 14,
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  eyeButton: {
    padding: 5,
  },
});

export default WalletBalanceCard;