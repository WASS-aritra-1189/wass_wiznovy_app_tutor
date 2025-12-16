import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import NotificationCard from '../components/NotificationCard';

interface NotificationPageProps {
  onBack?: () => void;
}

const NotificationPage: React.FC<NotificationPageProps> = ({
  onBack,
}) => {
  const notifications = [
    {
      id: 1,
      title: 'New Course Available',
      description: 'Check out our latest mathematics course for beginners',
      timeAgo: '5 minutes ago',
    },
    {
      id: 2,
      title: 'Assignment Due',
      description: 'Your physics assignment is due tomorrow',
      timeAgo: '15 minutes ago',
    },
    {
      id: 3,
      title: 'Class Reminder',
      description: 'Your chemistry class starts in 30 minutes',
      timeAgo: '25 minutes ago',
    },
    {
      id: 4,
      title: 'Grade Updated',
      description: 'Your biology test grade has been updated',
      timeAgo: '1 hour ago',
    },
    {
      id: 5,
      title: 'New Message',
      description: 'You have a new message from your instructor',
      timeAgo: '2 hours ago',
    },
    {
      id: 6,
      title: 'Course Completed',
      description: 'Congratulations! You completed the English course',
      timeAgo: '3 hours ago',
    },
    {
      id: 7,
      title: 'Study Reminder',
      description: 'Time to review your history notes',
      timeAgo: '4 hours ago',
    },
    {
      id: 8,
      title: 'New Quiz Available',
      description: 'A new geography quiz is now available',
      timeAgo: '5 hours ago',
    },
    {
      id: 9,
      title: 'Schedule Update',
      description: 'Your class schedule has been updated',
      timeAgo: '6 hours ago',
    },
    {
      id: 10,
      title: 'Achievement Unlocked',
      description: 'You earned a new badge for completing 10 lessons',
      timeAgo: '8 hours ago',
    },
    {
      id: 11,
      title: 'Payment Reminder',
      description: 'Your monthly subscription is due in 3 days',
      timeAgo: '12 hours ago',
    },
    {
      id: 12,
      title: 'New Feature',
      description: 'Check out our new study planner feature',
      timeAgo: '1 day ago',
    },
    {
      id: 13,
      title: 'Group Study',
      description: 'Join the mathematics study group session',
      timeAgo: '1 day ago',
    },
    {
      id: 14,
      title: 'System Update',
      description: 'The app has been updated with new features',
      timeAgo: '2 days ago',
    },
    {
      id: 15,
      title: 'Welcome',
      description: 'Welcome to our learning platform!',
      timeAgo: '3 days ago',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="keyboard-arrow-left" size={24} color="#FFFFFF" />
          <Text style={styles.backText}>Notifications</Text>
        </TouchableOpacity>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.notificationsContainer}>
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              title={notification.title}
              description={notification.description}
              timeAgo={notification.timeAgo}
              onPress={() => {
                // Handle notification press
                console.log('Notification pressed:', notification.title);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  scrollView: {
    flex: 1,
  },
  notificationsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});

export default NotificationPage;