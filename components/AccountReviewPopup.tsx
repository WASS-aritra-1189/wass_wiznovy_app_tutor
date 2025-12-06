import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';

interface AccountReviewPopupProps {
  visible: boolean;
  onExploreApp: () => void;
}

const AccountReviewPopup: React.FC<AccountReviewPopupProps> = ({ visible, onExploreApp }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Success Image at the top */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/success.png')} 
              style={styles.successImage}
              resizeMode="contain"
            />
          </View>
          
          {/* Header */}
          <Text style={styles.modalTitle}>YOUR ACCOUNT IS UNDER REVIEW</Text>
          
          {/* Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.modalText}>
              Please read the terms carefully before accepting. Review the permissions requested by the app (e.g., data access) and proceed only if you are comfortable with them.
            </Text>
          </View>

          {/* Explore App Button */}
          <TouchableOpacity 
            onPress={onExploreApp} 
            style={styles.exploreButton}
          >
            <Text style={styles.exploreButtonText}>Explore the App</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#FFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    minHeight: 500,
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  successImage: {
    width: 100,
    height: 100,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contentContainer: {
    marginBottom: 40,
    minHeight: 120,
  },
  modalText: {
    fontSize: 14,
    color: '#01004C',
    lineHeight: 20,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#16423C',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  exploreButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});

export default AccountReviewPopup;