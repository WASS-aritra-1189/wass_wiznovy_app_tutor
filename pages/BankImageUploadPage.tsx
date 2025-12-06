import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

interface BankImageUploadPageProps {
  navigation?: any;
  route?: any;
}

const BankImageUploadPage: React.FC<BankImageUploadPageProps> = ({ navigation, route }) => {
  const [bank_passbook_image, setBank_passbook_image] = useState<string | null>(null);
  const [bank_id_image, setBank_id_image] = useState<string | null>(null);
  const bankAccount = route?.params?.bankAccount;

  const pickImage = async (type: 'passbook' | 'idcard') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (type === 'passbook') {
        setBank_passbook_image(result.assets[0].uri);
      } else {
        setBank_id_image(result.assets[0].uri);
      }
    }
  };

  const handleSubmit = () => {
    if (!bank_passbook_image || !bank_id_image) {
      alert('Please upload both images');
      return;
    }

    navigation?.navigate('WithdrawPage', {
      bankAccount: {
        ...bankAccount,
        bank_passbook_image,
        bank_id_image
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Upload Documents</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Upload your Valid Passbook document *</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage('passbook')}>
            {bank_passbook_image ? (
              <Image source={{ uri: bank_passbook_image }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.imageCircle}>
                  <Image source={require('../assets/bank_passbook_image.png')} style={styles.placeholderImage} />
                </View>
                <Text style={styles.uploadText}>Tap to upload passbook image</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Upload your Valid ID document *</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage('idcard')}>
            {bank_id_image ? (
              <Image source={{ uri: bank_id_image }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.imageCircle}>
                  <Image source={require('../assets/bank_id_image.png')} style={styles.placeholderImage} />
                </View>
                <Text style={styles.uploadText}>Tap to upload ID card image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.submitButton, (!bank_passbook_image || !bank_id_image) && styles.buttonDisabled]} 
          onPress={handleSubmit}
          disabled={!bank_passbook_image || !bank_id_image}
        >
          <Text style={styles.submitButtonText}>Add Bank account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },


  fieldLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#01004C',
    marginBottom: 10,
    marginTop: 20,
  },
  imageUpload: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    borderStyle: 'dashed',
  },
  uploadPlaceholder: {
    padding: 50,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 14,
    color: '#16423C',
    textAlign: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#16423C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeholderImage: {
    width: 40,
    height: 40,
    tintColor: '#16423C',
  },
  imageCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BankImageUploadPage;