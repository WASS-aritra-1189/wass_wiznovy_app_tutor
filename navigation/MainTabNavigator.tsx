// navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import HomePage from '../pages/HomePage';

import ProfilePage from '../pages/ProfilePage';
import PaymentPage from '../pages/PaymentPage';
import WithdrawPage from '../pages/WithdrawPage';
import AddBankAccountPage from '../pages/AddBankAccountPage';
import AllCoursesPage from '../pages/AllCoursesPage';
import CreateCoursePage from '../pages/CreateCoursePage';
import UpdateCoursePage from '../pages/UpdateCoursePage';
import GeneralPolicyScreen from '../pages/generalPolicy';
import PolicyDetailPage from '../components/PolicyDetailPage';
import NotificationPage from '../pages/NotificationPage';
import CourseDetailsPage from '../pages/CourseDetailsPage';
import VideoDetailsPage from '../pages/VideoDetailsPage';
import CourseVideoPage from '../pages/CourseVideoPage';
import YoutubeTypePlayer from '../pages/YoutubeTypePlayer';
import CategorySubjectsPage from '../pages/CategorySubjectsPage';
import SubjectTeachersPage from '../pages/SubjectTeachersPage';
import TutorDetailPage from '../pages/TutorDetailPage';
import BookingsListPage from '../pages/BookingsListPage';
import CourseUnitsPage from '../pages/CourseUnitsPage';
import UploadUnitPage from '../pages/UploadUnitPage';
import UnitDetailsPage from '../pages/UnitDetailsPage';
import UploadStudyMaterialPage from '../pages/UploadStudyMaterialPage';
import UploadVideoPage from '../pages/UploadVideoPage';
import CreateUnitPage from '../pages/CreateUnitPage';
import CreateVideoLecturePage from '../pages/CreateVideoLecturePage';
import CreateStudyMaterialPage from '../pages/CreateStudyMaterialPage';
import UpdateStudyMaterialPage from '../pages/UpdateStudyMaterialPage';
import BankImageUploadPage from '../pages/BankImageUploadPage';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab Navigator Component
const TabNavigator = ({ onLogout }: { onLogout?: () => void }) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#16412c',
          borderWidth: 1,
          borderColor: '#16423C',
          height: 70,
          marginHorizontal: 20,
          marginBottom: insets.bottom + 20,
          paddingBottom: 5,
          paddingTop: 5,
          paddingHorizontal: 0,
          borderRadius: 45,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: '#16423C',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarShowLabel: false,
        tabBarItemStyle: {
          borderRadius: 10,
          marginHorizontal: 5,
          flex: 1,
        },
        lazy: true, // Enable lazy loading
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 30,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 23,
            }}>
              <Image
                source={require('../assets/tutorhome.png')}
                style={{
                  width: 27,
                  height: 29,
                  tintColor: focused ? '#16423C' : '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationPage} // Replace with actual Learning screen
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 30,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 23,
            }}>
              <Image
                source={require('../assets/notifytutor.png')}
                style={{
                  width: 27,
                  height: 29,
                  tintColor: focused ? '#16423C' : '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Upload"
        component={AllCoursesPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 30,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 23,
            }}>
              <Image
                source={require('../assets/uploadtutor.png')}
                style={{
                  width: 22,
                  height: 29,
                  tintColor: focused ? '#16423C' : '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Purse"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 30,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 23,
            }}>
              <Image
                source={require('../assets/tutorpurse.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#16423C' : '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      >
        {(props: any) => (
          <PaymentPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{
              backgroundColor: focused ? '#FFFFFF' : 'transparent',
              borderRadius: 30,
              width: 60,
              height: 60,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 23,
            }}>
              <Image
                source={require('../assets/tutorprofile.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? '#16423C' : '#FFFFFF',
                }}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      >
        {(props: any) => (
          <ProfilePage
            {...props}
            onLogout={onLogout}
            onBack={() => props.navigation.goBack()}
            navigation={props.navigation}
          />
        )}
      </Tab.Screen>

    </Tab.Navigator>
  );
};

// Main Navigator with Stack for additional screens
const MainTabNavigator = ({ onLogout }: { onLogout?: () => void }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="GeneralPolicy">
        {(props: any) => (
          <GeneralPolicyScreen
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PolicyDetail">
        {(props: any) => (
          <PolicyDetailPage
            {...props}
            title={props.route?.params?.title || 'Policy'}
            content={props.route?.params?.content || 'Policy content'}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="Notifications" component={NotificationPage} />
    
      <Stack.Screen name="CourseDetails" component={CourseDetailsPage} />
      <Stack.Screen name="VideoDetailsPage" component={VideoDetailsPage} />
      <Stack.Screen name="CourseVideoPage" component={CourseVideoPage} />
      <Stack.Screen name="YoutubeTypePlayer" component={YoutubeTypePlayer} />
      <Stack.Screen name="CategorySubjects">
        {(props: any) => (
          <CategorySubjectsPage
            {...props}
            categoryMainImage={props.route?.params?.categoryMainImage || ''}
            tutors={props.route?.params?.tutors || []}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="SubjectTeachersPage">
        {(props: any) => (
          <SubjectTeachersPage
            {...props}
            subjectTitle={props.route?.params?.subjectTitle || 'Subject'}
            teachers={props.route?.params?.teachers || []}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="TutorDetailPage">
        {(props: any) => (
          <TutorDetailPage
            {...props}
            tutor={props.route?.params?.tutor}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BookingsListPage" component={BookingsListPage} />
      <Stack.Screen name="CreateCourse">
        {(props: any) => (
          <CreateCoursePage
            {...props}
            onSubmit={(courseData: any) => {
              console.log('New course created:', courseData);
            }}
            onBack={() => {
              if (props.navigation.canGoBack()) {
                props.navigation.goBack();
              } else {
                props.navigation.navigate('MainTabs');
              }
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BankImageUpload" component={BankImageUploadPage} />
      <Stack.Screen name="CourseUnits">
        {(props: any) => (
          <CourseUnitsPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UploadUnit">
        {(props: any) => (
          <UploadUnitPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UnitDetails">
        {(props: any) => (
          <UnitDetailsPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UploadStudyMaterial" component={UploadStudyMaterialPage} />
      <Stack.Screen name="CreateStudyMaterial" component={CreateStudyMaterialPage} />
      <Stack.Screen name="UpdateStudyMaterial" component={UpdateStudyMaterialPage} />
      <Stack.Screen name="UploadVideo" component={UploadVideoPage} />
      <Stack.Screen name="CreateUnit" component={CreateUnitPage} />
      <Stack.Screen name="CreateVideoLecture" component={CreateVideoLecturePage} />
      <Stack.Screen name="UpdateCourse">
        {(props: any) => (
          <UpdateCoursePage
            {...props}
            onSubmit={(courseData: any) => {
              console.log('Course updated:', courseData);
            }}
            onBack={() => {
              if (props.navigation.canGoBack()) {
                props.navigation.goBack();
              } else {
                props.navigation.navigate('MainTabs');
              }
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="WithdrawPage">
        {(props: any) => (
          <WithdrawPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddBankAccount">
        {(props: any) => (
          <AddBankAccountPage
            {...props}
            onBack={() => props.navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainTabNavigator;