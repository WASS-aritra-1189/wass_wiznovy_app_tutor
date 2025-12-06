import React from 'react';
import { View, StyleSheet } from 'react-native';
import OnlineClassCard from './OnlineClassCard';

const TutorStatsCards: React.FC = () => {
  return (
    <View style={styles.container}>
      <OnlineClassCard count={12} label="Online Class Today" />
      <OnlineClassCard count={8} label="Offline Class Today" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
});

export default TutorStatsCards;