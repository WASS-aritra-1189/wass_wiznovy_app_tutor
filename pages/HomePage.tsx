import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

import Navbar from '../components/Navbar';
import Calendar from '../components/Calendertutor';
import TutorStatsCards from '../components/TutorStatsCards';
import WalletCard from '../components/WalletCard';
import InfoCardsSection from '../components/InfoCardsSection';
import AlertComponent from '../components/AlertComponent';
import { sessionsService } from '../services/sessionsService';


interface HomePageProps {
  userGender?: string;
  userName?: string;
}

const HomePage: React.FC<HomePageProps> = ({ userGender = 'Male', userName = 'User' }) => {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [appointmentDates, setAppointmentDates] = useState<number[]>([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const bannerImages = [
    require('../assets/tutormain.png'),
    require('../assets/tutormain.png'),
    require('../assets/tutormain.png'),
  ];
  
  const { width } = Dimensions.get('window');
  const imageWidth = width - 40;

  const fetchSessions = async (year: number = currentYear, month: number = currentMonth) => {
    try {
      const response = await sessionsService.getTutorSessions(100, 0);
      
      if (!response || !response.result || !Array.isArray(response.result)) {
        setAppointmentDates([]);
        setTotalAppointments(0);
        return;
      }
      
      const filteredSessions = response.result.filter(session => {
        if (!session.sessionDate) return false;
        const sessionDate = new Date(session.sessionDate);
        return sessionDate.getMonth() === month && sessionDate.getFullYear() === year;
      });
      
      const dates = filteredSessions.map(session => {
        const sessionDate = new Date(session.sessionDate);
        return sessionDate.getDate();
      });
      
      const uniqueDates = [...new Set(dates)];
      setAppointmentDates(uniqueDates);
      setTotalAppointments(filteredSessions.length);
      
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setAppointmentDates([]);
      setTotalAppointments(0);
    }
  };

  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
    fetchSessions(year, month);
  };

  useEffect(() => {
    fetchSessions(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % bannerImages.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * imageWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [imageWidth, bannerImages.length]);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <AlertComponent visible={showAlert} message={alertMessage} />
      
      <Navbar userGender={userGender} userName={userName} navigation={navigation}/>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerScrollView}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
              setCurrentIndex(newIndex);
            }}
          >
            {bannerImages.map((image, index) => (
              <Image 
                key={index}
                source={image} 
                style={[styles.bannerImage, { width: imageWidth }]}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {bannerImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  currentIndex === index && styles.paginationDotActive
                ]}
              />
            ))}
          </View>
        </View>

        
        <TutorStatsCards />
        
        <View style={styles.calendarContainer}>
          <Calendar 
            appointmentDates={appointmentDates} 
            totalAppointments={totalAppointments}
            onMonthChange={handleMonthChange}
          />
        </View>
        
        <View style={styles.walletContainer}>
          <WalletCard amount={1250} type={"$ "} text={"Total Earning"} imageSource={require('../assets/tutorpurse.png')} />
        </View>

        <View style={styles.walletContainer}>
          <WalletCard 
            amount={10} 
            text={"New Bookings"} 
            imageSource={require('../assets/TICK.png')}
            onPress={() => navigation.navigate('BookingsListPage')}
          />
        </View>
        
        <InfoCardsSection />
        
        <View style={styles.spacer} />
      </ScrollView>
      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },


  content: {
    flex: 1,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerScrollView: {
    height: 200,
  },
  bannerImage: {
    height: 180,
    borderRadius: 12,
    marginRight: 0,
    borderWidth: 1,
    borderColor: '#000000',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C4DAD2',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#16423C',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  calendarContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  walletContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  spacer: {
    height: 30,
  },
});

export default HomePage;