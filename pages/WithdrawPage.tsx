import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

interface WithdrawPageProps {
  navigation?: any;
  route?: any;
  onBack?: () => void;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ navigation, route, onBack }) => {
  // Get bank account from navigation params or use existing state
  const [bankAccount] = useState(route?.params?.bankAccount || null);

  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  const handleAddBankAccount = () => {
    navigation?.navigate('AddBankAccount');
  };

  const handleWithdraw = () => {
    // Navigate to withdraw amount page
    console.log('Navigate to withdraw amount');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Withdraw Amount</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bankAccount ? (
          // Show bank account details
          <View style={styles.bankAccountSection}>
            <Text style={styles.sectionTitle}>Bank Account Details</Text>
            
            <View style={styles.accountCard}>
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>Account Holder</Text>
                <Text style={styles.accountValue}>{bankAccount.accountHolderName}</Text>
              </View>
              
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>Bank Name</Text>
                <Text style={styles.accountValue}>{bankAccount.bankName}</Text>
              </View>
              
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>Account Number</Text>
                <Text style={styles.accountValue}>****{bankAccount.accountNumber.slice(-4)}</Text>
              </View>
              
              <View style={styles.accountRow}>
                <Text style={styles.accountLabel}>IFSC Code</Text>
                <Text style={styles.accountValue}>{bankAccount.ifscCode}</Text>
              </View>
              
              {bankAccount.swiftCode && (
                <View style={styles.accountRow}>
                  <Text style={styles.accountLabel}>SWIFT Code</Text>
                  <Text style={styles.accountValue}>{bankAccount.swiftCode}</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
              <Text style={styles.withdrawButtonText}>Proceed to Withdraw</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Show add bank account prompt
          <View style={styles.noBankAccountSection}>
            <MaterialIcons name="account-balance" size={80} color="#CCCCCC" />
            <Text style={styles.noBankTitle}>No Bank Account Added</Text>
            <Text style={styles.noBankSubtitle}>
              Please add your bank account details to withdraw money
            </Text>
            
            <TouchableOpacity style={styles.addBankButton} onPress={handleAddBankAccount}>
              <MaterialIcons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addBankButtonText}>Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
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
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bankAccountSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 20,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accountLabel: {
    fontSize: 14,
    color: '#666666',
  },
  accountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
  },
  withdrawButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noBankAccountSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noBankTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#01004C',
    marginTop: 20,
    marginBottom: 10,
  },
  noBankSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  addBankButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16423C',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    gap: 8,
  },
  addBankButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawPage;