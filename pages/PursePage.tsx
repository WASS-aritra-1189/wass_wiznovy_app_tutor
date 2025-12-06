import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface PursePageProps {
  onBack?: () => void;
  navigation?: any;
}

const PursePage: React.FC<PursePageProps> = ({ onBack, navigation }) => {
  const [balance] = useState(2450.75);
  const [pendingAmount] = useState(320.50);

  const handleAddBankAccount = () => {
    navigation?.navigate('AddBankAccount');
  };

  const handleWithdraw = () => {
    // Handle withdraw functionality
  };

  const handleTransactionHistory = () => {
    // Handle transaction history
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>My Wallet</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <MaterialIcons name="account-balance-wallet" size={32} color="#16423C" />
            <Text style={styles.balanceTitle}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.pendingContainer}>
            <MaterialIcons name="schedule" size={16} color="#FFA500" />
            <Text style={styles.pendingText}>Pending: ${pendingAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={handleAddBankAccount}>
            <View style={styles.actionIcon}>
              <Image source={require('../assets/bank.png')} style={styles.bankIcon} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Add Bank Account</Text>
              <Text style={styles.actionSubtitle}>Link your bank account for withdrawals</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleWithdraw}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="money" size={24} color="#16423C" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Withdraw Money</Text>
              <Text style={styles.actionSubtitle}>Transfer earnings to your bank</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={handleTransactionHistory}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="history" size={24} color="#16423C" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Transaction History</Text>
              <Text style={styles.actionSubtitle}>View all your transactions</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          
          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <MaterialIcons name="add" size={20} color="#4CAF50" />
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionTitle}>Course Payment Received</Text>
              <Text style={styles.transactionDate}>Nov 24, 2024</Text>
            </View>
            <Text style={styles.transactionAmount}>+$45.00</Text>
          </View>

          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <MaterialIcons name="remove" size={20} color="#FF4444" />
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionTitle}>Withdrawal to Bank</Text>
              <Text style={styles.transactionDate}>Nov 22, 2024</Text>
            </View>
            <Text style={styles.transactionAmountNegative}>-$200.00</Text>
          </View>

          <View style={styles.transactionItem}>
            <View style={styles.transactionIcon}>
              <MaterialIcons name="add" size={20} color="#4CAF50" />
            </View>
            <View style={styles.transactionContent}>
              <Text style={styles.transactionTitle}>Session Payment</Text>
              <Text style={styles.transactionDate}>Nov 20, 2024</Text>
            </View>
            <Text style={styles.transactionAmount}>+$75.00</Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 10,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 10,
  },
  pendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#FFA500',
    marginLeft: 5,
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  bankIcon: {
    width: 24,
    height: 24,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
  transactionsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  transactionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  transactionAmountNegative: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF4444',
  },
  spacer: {
    height: 30,
  },
});

export default PursePage;