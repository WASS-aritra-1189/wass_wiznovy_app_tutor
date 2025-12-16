import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {DrawerContentComponentProps } from '@react-navigation/drawer';

interface MenuPageProps extends DrawerContentComponentProps {
  userName?: string;
  userEmail?: string;
  profileImage?: string;
  onClose?: () => void;
}

const MenuPage: React.FC<MenuPageProps> = ({ userName = 'User', userEmail = 'user@example.com', profileImage, navigation, onClose, ...props }) => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with Close Button */}
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={onClose || (() => navigation?.closeDrawer?.())} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Box */}
      <TouchableOpacity style={styles.userInfoBox} onPress={() => {
        onClose?.();
        navigation?.navigate?.('MainTabs', { screen: 'Profile' });
      }}>
        <View style={styles.profileIcon}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('../assets/humanimage.png')} 
            style={styles.profileImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.userTextContainer}>
          <Text style={styles.userName}>Hello Mr. {userName}</Text>
          <Text style={styles.personalDetailsText}>Personal Details</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Menu Sections Container */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {/* For You Section 1 */}
        <Text style={styles.sectionTitle}>For you</Text>
        <View style={styles.forYouSection1}>
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuschedule.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Your Schedule</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menusavedbooks.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Your Saved Books</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menudailutasks.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Your Daily Task</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/tutorimage.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Your Tutors</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuliveclass.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Your Live Classes</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Wallet Banking Section */}
        <Text style={styles.sectionTitle}>wallet & Banking</Text>
        <View style={styles.walletBankingSection}>
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuwallet.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Wallet</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menutransactionhistory.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Transaction History</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menufaqs.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>FAQ's</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuoffersandcoupons.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Offers & Coupons</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menureffral.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Referral Program</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* For You Section 2 */}
        <Text style={styles.sectionTitle}>For you</Text>
        <View style={styles.forYouSection2}>
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuopenlibrary.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Open Library</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/Vector.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Rating & review</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Policy Section */}
        <Text style={styles.sectionTitle}>Policy</Text>
        <View style={styles.policySection}>
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menuprivacy.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Privacy Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menurefund.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Refund Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menutermsandcondition.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Terms & Conditions</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menucopursepolicy.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>Course Policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItemWithIconContainer}>
            <Image source={require('../assets/menugdpr.png')} style={styles.menuIcon} />
            <Text style={styles.menuItemWithIcon}>GDPR policy</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Version Text */}
        <Text style={styles.versionText}>App Version 1.0.1</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C4DAD2',
    paddingTop: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerSection: {
    backgroundColor: '#C4DAD2',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    alignItems: 'flex-end',
    borderTopRightRadius: 20,
  },
  userInfoBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#16423C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    color: '#333333',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    color: '#666666',
    fontSize: 14,
  },
  personalDetailsText: {
    color: '#16423C',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  closeText: {
    color: '#16423C',
    fontSize: 28,
    fontWeight: '200',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#C4DAD2',
  },
  forYouSection1: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  walletBankingSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  forYouSection2: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  policySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  appVersionSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16423C',
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginTop: 6,
  },

  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  menuItem: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  arrow: {
    color: '#999999',
    fontSize: 18,
    fontWeight: '300',
  },
  menuItemWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    opacity: 0.35,
  },
  menuItemWithIcon: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '400',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginLeft: 15,
  },

  versionText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default MenuPage;