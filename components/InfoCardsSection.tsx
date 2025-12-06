import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import InfoCard from './InfoCard';

const InfoCardsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <InfoCard 
          image={require('../assets/policytutor.png')} 
          title="Policy" 
          subtitle="Terms & Conditions, Privacy Policy" 
        />
        <InfoCard 
          image={require('../assets/sharetutor.png')} 
          title="Share" 
          subtitle="Refer friends and earn rewards" 
        />
        <InfoCard 
          image={require('../assets/faqtutor.png')} 
          title="FAQ" 
          subtitle="Frequently Asked Questions" 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingLeft: 20,
  },
  scrollContent: {
    paddingRight: 10, 
    gap: 5,
  },
});

export default InfoCardsSection;