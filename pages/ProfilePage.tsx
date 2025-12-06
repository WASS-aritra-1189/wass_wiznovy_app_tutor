import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchProfile } from '../store/profileSlice';
import GradientBanner from '../components/GradientBanner';
import ProfileCard from '../components/ProfileCard';
import Button from '../components/Button';
import ProfileStatusCard from '../components/ProfileStatusCard';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileCardsSection from '../components/ProfileCardsSection';
import ProfileUpdateForm from '../components/ProfileUpdateForm';
import TermsConditionsPopup from '../components/TermsConditionsPopup';
import LogoutConfirmationPopup from '../components/LogoutConfirmationPopup';
import SuccessPopup from '../components/SuccessPopup';
import ErrorPopup from '../components/ErrorPopup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { logoutUser } from '../services/authService';
import { removeToken } from '../services/storage';
import { RootState, AppDispatch } from '../store/store';

interface ProfilePageProps {
  onBack?: () => void;
  onEdit?: () => void;
  userName?: string;
  profileCompletion?: number;
  onAddChild?: () => void;
  onMyCourses?: () => void;
  onSchedules?: () => void;
  onSearchPress?: () => void;
  onHomePress?: () => void;
  onProfilePress?: () => void;
  onLogout?: () => void;
  navigation?: any;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onBack, 
  onEdit, 
  userName = 'John Doe', 
  profileCompletion = 90,
  onAddChild,
  onMyCourses,
  onSchedules,
  onSearchPress,
  onHomePress,
  onProfilePress,
  onLogout,
  navigation
}) => {
  const [showTermsPopup, setShowTermsPopup] = React.useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = React.useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [showErrorPopup, setShowErrorPopup] = React.useState(false);
  const [showUpdateForm, setShowUpdateForm] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { profile, loading } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  
  React.useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      setShowUpdateForm(false);
      dispatch(fetchProfile());
    }, [dispatch])
  );


  const updateFormRef = useRef<(() => void) | null>(null);
  const displayName = useMemo(() => {
    if (loading.fetch && !profile) {
      return 'Loading...';
    }
    
    const name = profile?.tutorDetail?.name?.trim();
    if (name) {
      return name;
    }
    
    if (!profile) {
      return userName;
    }
    
    return loading.fetch ? 'Loading...' : 'No Name';
  }, [loading.fetch, profile?.tutorDetail?.name, userName, profile]);
  
  const profileImageUri = useMemo(() => {
    const imageUri = profile?.tutorDetail?.profileImage ? 
      { uri: profile.tutorDetail.profileImage } : 
      require('../assets/walkthrough2.png');
    return imageUri;
  }, [profile?.tutorDetail?.profileImage]);

  const calculatedProfileCompletion = useMemo(() => {
    if (!profile?.tutorDetail) {
      return loading.fetch ? 0 : profileCompletion;
    }

    const fields = [
      profile.tutorDetail.name,
      profile.email,
      profile.tutorDetail.city,
      profile.tutorDetail.country,
      profile.tutorDetail.subject,
      profile.tutorDetail.hourlyRate,
      profile.tutorDetail.language,
      profile.tutorDetail.bio,
      profile.tutorDetail.profileImage
    ];

    const completedFields = fields.filter(field => field && field !== '').length;
    const completion = Math.round((completedFields / fields.length) * 100);

    return completion;
  }, [profile, profileCompletion]);

  const handleTermsAccept = () => {
    setShowTermsPopup(false);
    // Handle terms acceptance logic here
  };

  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutPopup(false);
    
    try {
      // Call logout API first
      const logoutResult = await logoutUser();
      
      if (logoutResult.success) {
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          onLogout?.();
        }, 1500);
      } else {
        setErrorMessage(logoutResult.message || 'Logout failed');
        setShowErrorPopup(true);
        // Still logout locally even if API fails
        setTimeout(() => {
          setShowErrorPopup(false);
          onLogout?.();
        }, 2000);
      }
    } catch (error) {
      setErrorMessage('Network error during logout');
      setShowErrorPopup(true);
      // Still logout locally even if API fails
      setTimeout(() => {
        setShowErrorPopup(false);
        onLogout?.();
      }, 2000);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutPopup(false);
  };

  const handleUpdateProfile = () => {
    setShowUpdateForm(true);
  };

  const handleBackFromUpdate = () => {
    setShowUpdateForm(false);
    dispatch(fetchProfile());
  };

  if (showUpdateForm) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#16423C" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackFromUpdate} style={styles.backButton}>
            <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
            <Text style={styles.backText}>Update Profile</Text>
          </TouchableOpacity>
          <View style={styles.headerPlaceholder} />
        </View>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ProfileUpdateForm onUpdate={updateFormRef} onBackToProfile={handleBackFromUpdate} />
        </ScrollView>
        
        {/* Floating Update Button */}
        <TouchableOpacity 
          style={styles.floatingUpdateButton}
          onPress={() => updateFormRef.current?.()}
        >
          <Text style={styles.floatingUpdateButtonText}>
            {loading.update ? 'Updating...' : 'Update'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>My Profile</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Status Card */}
        <ProfileStatusCard 
          isVerified={true}
          completionPercentage={calculatedProfileCompletion}
        />
        
        {/* Profile Info Card */}
        <ProfileInfoCard 
          imageSource={profileImageUri}
          name={displayName}
          completionPercentage={calculatedProfileCompletion}
          title="Welcome to Your Dashboard"
          subtitle="Complete your profile to unlock more features and get better learning recommendations."
          onUpdatePress={handleUpdateProfile}
          isLoading={loading.fetch || loading.update}
        />
        

        <ProfileCardsSection />
      
        <View style={styles.buttonContainer}>
          <Button 
            title="General Policy"
            onPress={() => navigation?.navigate('GeneralPolicy')}
            variant="primary"
            style={styles.policyButton}
          />
        </View>
      
        <View style={styles.logoutContainer}>
          <Button 
            title="Logout"
            onPress={handleLogout}
            variant="primary"
            style={styles.logoutButton}
          />
        </View>
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <TermsConditionsPopup
        visible={showTermsPopup}
        onAccept={handleTermsAccept}
        onClose={() => setShowTermsPopup(false)}
      />
      
      <LogoutConfirmationPopup
        visible={showLogoutPopup}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
      

      
      <SuccessPopup
        visible={showSuccessPopup}
        message="Logout successful!"
        onClose={() => setShowSuccessPopup(false)}
      />
      
      <ErrorPopup
        visible={showErrorPopup}
        message={errorMessage}
        onClose={() => setShowErrorPopup(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginLeft: 0,
  },
  headerPlaceholder: {
    width: 24,
  },
  profileContainer: {
    backgroundColor: '#16423C',
    height: 324,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pencilIcon: {
    width: 20,
    height: 20,
  },
  profileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blueQuarter: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 70,
    height: 70,
    backgroundColor: '#28DEFB',
    borderTopRightRadius: 70,
  },
  innerCircle: {
    width: 125,
    height: 125,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 65,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileCompletion: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 13,
    justifyContent: 'space-between',
  },
  spacer: {
    height: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginTop: 20,
  },
  policyButton: {
    flex: 1,
  },
  supportButton: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  policyButton: {
    backgroundColor: '#16423C',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
  },
  floatingUpdateButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: '#16423C',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingUpdateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default React.memo(ProfilePage);