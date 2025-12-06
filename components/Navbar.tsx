import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../store/profileSlice';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import MenuPage from '../pages/MenuPage';
import { RootState, AppDispatch } from '../store/store';

interface NavbarProps {
  userGender?: string;
  userName?: string;
  navigation?: DrawerNavigationProp<any>;
  onMenuToggle?: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userGender = 'Male', userName = 'User', navigation: navProp, onMenuToggle }) => {
  const defaultNavigation = useNavigation<DrawerNavigationProp<any>>();
  const navigation = navProp ?? defaultNavigation;
  const [menuVisible, setMenuVisible] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [menuSlideAnim] = useState(() => new Animated.Value(-320));
  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch<AppDispatch>();
  
  React.useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);
    const getGreeting = () => {
    const apiName = profile?.tutorDetail?.name;
    const apiGender = profile?.tutorDetail?.gender;
   
    
    const displayName = apiName || userName;
    
    let prefix = '';
    if (apiGender === 'MALE' || apiGender === 'Male') {
      prefix = 'Mr. ';
    } else if (apiGender === 'FEMALE' || apiGender === 'Female') {
      prefix = 'Mrs. ';
    }
    return { hello: 'Hello', name: `${prefix}${displayName}` };
  };

  const openMenu = () => {
    setMenuVisible(true);
    onMenuToggle?.(true);
    menuSlideAnim.setValue(-320);
    Animated.timing(menuSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    onMenuToggle?.(false);
    Animated.timing(menuSlideAnim, {
      toValue: -320,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  return (
    <View style={styles.navbar}>
      <View style={styles.topRow}>
        <View style={styles.leftSection}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={openMenu}
          >
            <View style={styles.tutorImageContainer}>
              <Image 
                source={(() => {
                  const imageUri = profile?.tutorDetail?.profileImage;
                 
                  if (imageUri) {
                    
                    return { uri: imageUri };
                  } else {
                    
                    return require('../assets/tutorimage.png');
                  }
                })()} 
                style={styles.tutorImage}
                resizeMode="cover"
                // onLoad={() => console.log('Image loaded successfully')}
                // onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                // onLoadStart={() => console.log('Image load started')}
                // onLoadEnd={() => console.log('Image load ended')}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.greetingContainer}>
            <Text style={styles.helloText}>{getGreeting().hello}</Text>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>{getGreeting().name}</Text>
              <Image 
                source={require('../assets/TICK.png')} 
                style={styles.tickIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          <View style={styles.ratingContainer}>
            <Text style={styles.stars}>5 ★</Text>
          </View>
          <View style={styles.countryContainer}>
            <Text style={styles.flag}>🇺🇸</Text>
            <Text style={styles.countryName}>USA</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.separator} />
      
      <View style={styles.bottomRow}>
        <Text style={styles.balanceLabel}>Account Earning Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{balanceVisible ? '$ 1,250.00' : '****'}</Text>
          <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)} style={styles.visibilityButton}>
            <MaterialIcons 
              name={balanceVisible ? 'visibility' : 'visibility-off'} 
              size={16} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <Modal
        visible={menuVisible}
        animationType="none"
        transparent={true}
        statusBarTranslucent={true}
      >
        <View style={styles.menuModalOverlay}>
          <TouchableOpacity 
            style={styles.menuModalBackground}
            onPress={closeMenu}
            activeOpacity={1}
          />
          <Animated.View style={[styles.menuContainer, { transform: [{ translateX: menuSlideAnim }] }]}>
            <MenuPage 
              navigation={navigation as any} 
              userName={profile?.tutorDetail?.name?.trim() || userName} 
              userEmail={profile?.email?.trim() || 'user@example.com'} 
              profileImage={profile?.tutorDetail?.profileImage} 
              onClose={closeMenu}
              state={{} as any}
              descriptors={{} as any}
            />
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#16423C',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 10,
  },
  bottomRow: {
    paddingLeft: 15,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  greetingContainer: {
    marginLeft: 15,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helloText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tickIcon: {
    width: 16,
    height: 16,
    marginLeft: 5,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 4,
    paddingBottom: 2,

  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  balanceAmount: {
    fontFamily: 'Inter',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 18,
    letterSpacing: 0,
    color: '#FFFFFF',
  },
  visibilityButton: {
    marginLeft: 10,
  },
  journeyText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stars: {
    fontSize: 14,
    color: '#FFD700',
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  flag: {
    fontSize: 14,
    marginRight: 4,
  },
  countryName: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '500',
  },
  tutorImageContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#16423C',
    overflow: 'hidden',
  },
  tutorImage: {
    width: '100%',
    height: '100%',
  },

  menuModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuModalBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '20%',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
  },
});

export default Navbar;