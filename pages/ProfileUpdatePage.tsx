import React from 'react';
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import ProfileUpdateForm from '../components/ProfileUpdateForm';

const ProfileUpdatePage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16423C" />
      <View style={styles.content}>
        <ProfileUpdateForm />
      </View>
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
});

export default ProfileUpdatePage;