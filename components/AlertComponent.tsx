import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AlertComponentProps {
  visible: boolean;
  message: string;
}

const AlertComponent: React.FC<AlertComponentProps> = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.alertContainer}>
      <View style={styles.alertContent}>
        <Text style={styles.alertIcon}>⚠️</Text>
        <Text style={styles.alertText}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#16423c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 99999,
    elevation: 99999,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertIcon: {
    fontSize: 16,
    // marginRight: -80,
    marginLeft: 30,
  },
  alertText: {
    color: '#ffffffff',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginLeft: -30,
  },
});

export default AlertComponent;