import React from 'react';
import { View, StyleSheet } from 'react-native';
import InfoCard from './InfoCard';

const PaymentCardsGrid: React.FC = () => {
  const paymentCards = [
    {
      image: require('../assets/policytutor.png'),
      title: 'Add Money',
      subtitle: 'Top up your wallet balance'
    },
    {
      image: require('../assets/sharetutor.png'),
      title: 'Send Money',
      subtitle: 'Transfer to other users'
    },
    {
      image: require('../assets/faqtutor.png'),
      title: 'Withdraw',
      subtitle: 'Cash out to bank account'
    },
    {
      image: require('../assets/history.png'),
      title: 'History',
      subtitle: 'View transaction history'
    },
    {
      image: require('../assets/receipt.png'),
      title: 'Bills',
      subtitle: 'Pay utility bills'
    },
    {
      image: require('../assets/help.png'),
      title: 'Support',
      subtitle: 'Get help with payments'
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {paymentCards.slice(0, 2).map((card) => (
          <View key={card.title} style={styles.cardWrapper}>
            <InfoCard
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
            />
          </View>
        ))}
      </View>
      
      <View style={styles.row}>
        {paymentCards.slice(2, 4).map((card) => (
          <View key={card.title} style={styles.cardWrapper}>
            <InfoCard
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
            />
          </View>
        ))}
      </View>
      
      <View style={styles.row}>
        {paymentCards.slice(4, 6).map((card) => (
          <View key={card.title} style={styles.cardWrapper}>
            <InfoCard
              image={card.image}
              title={card.title}
              subtitle={card.subtitle}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  cardWrapper: {
    flex: 1,
  },
});

export default PaymentCardsGrid;