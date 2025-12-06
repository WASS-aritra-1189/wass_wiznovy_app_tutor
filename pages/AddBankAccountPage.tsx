import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

interface AddBankAccountPageProps {
  navigation?: any;
  onBack?: () => void;
}

const AddBankAccountPage: React.FC<AddBankAccountPageProps> = ({ navigation, onBack }) => {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [showAccountNumber, setShowAccountNumber] = useState(false);


  const handleGoBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  const handleSave = () => {
    // Validate and save bank account
    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      alert('Please fill all required fields');
      return;
    }
    
    if (accountNumber !== confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    
    console.log('Save bank account:', {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      swiftCode
    });
    
    // Navigate to image upload page
    navigation?.navigate('BankImageUpload', {
      bankAccount: {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        swiftCode
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Add Bank Account</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.fieldLabel}>Account Holder Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name as per bank records"
              value={accountHolderName}
              onChangeText={(text) => setAccountHolderName(text.replace(/[^a-zA-Z\s]/g, ''))}
            />

            <Text style={styles.fieldLabel}>Bank Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter bank name"
              value={bankName}
              onChangeText={(text) => setBankName(text.replace(/[^a-zA-Z\s]/g, ''))}
            />



            <Text style={styles.fieldLabel}>Account Number *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputWithIcon}
                placeholder="Enter account number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="numeric"
                secureTextEntry={!showAccountNumber}
              />
              <TouchableOpacity onPress={() => setShowAccountNumber(!showAccountNumber)} style={styles.eyeIcon}>
                <MaterialIcons 
                  name={showAccountNumber ? "visibility" : "visibility-off"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Confirm Account Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter account number"
              value={confirmAccountNumber}
              onChangeText={setConfirmAccountNumber}
              keyboardType="numeric"
            />

            <Text style={styles.fieldLabel}>IFSC Code *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC code"
              value={ifscCode}
              onChangeText={(text) => setIfscCode(text.replace(/[^a-zA-Z0-9]/g, ''))}
              autoCapitalize="characters"
            />

            <Text style={styles.fieldLabel}>SWIFT Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter SWIFT code (for international transfers)"
              value={swiftCode}
              onChangeText={(text) => setSwiftCode(text.replace(/[^a-zA-Z0-9]/g, ''))}
              autoCapitalize="characters"
            />

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color="#16423C" />
              <Text style={styles.infoText}>
                Please ensure all details are correct. Bank account verification may take 1-2 business days.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleGoBack}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Account</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  },
  scrollContent: {
    paddingBottom: 150,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#01004C',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
  },
  inputWithIcon: {
    flex: 1,
    padding: 12,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 12,
  },

  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F7FF',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#16423C',
    lineHeight: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333333',
    fontWeight: 'bold',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 6,
    backgroundColor: '#16423C',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AddBankAccountPage;