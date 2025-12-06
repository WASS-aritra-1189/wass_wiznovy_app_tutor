import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image, Animated } from 'react-native';

interface BookingActionPopupProps {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject: () => void;
  studentName: string;
  schedule: string;
  classBookedFor: string;
  date: string;
  price: string;
}

const BookingActionPopup: React.FC<BookingActionPopupProps> = ({
  visible,
  onClose,
  onAccept,
  onReject,
  studentName,
  schedule,
  classBookedFor,
  date,
  price
}) => {
  const innerCircleOpacity = useRef(new Animated.Value(0)).current;
  const outerCircleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createRippleAnimation = () => {
      const rippleSequence = Animated.sequence([
        Animated.timing(innerCircleOpacity, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(outerCircleOpacity, {
          toValue: 0.6,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(innerCircleOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(outerCircleOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
      ]);

      Animated.loop(rippleSequence).start();
    };

    if (visible) {
      createRippleAnimation();
    }
  }, [visible, innerCircleOpacity, outerCircleOpacity]);
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={styles.header}>
            <Text style={styles.title}>Class Request</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.iconContainer}>
            <Animated.View style={[styles.outerWhiteCircle, { opacity: outerCircleOpacity }]} />
            <Animated.View style={[styles.innerGreenCircle, { opacity: innerCircleOpacity }]} />
            <Image 
              source={require('../assets/Wiznovy_logo.png')} 
              style={styles.acceptRejectIcon}
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.content}>
            <View style={styles.studentInfo}>
              <Image 
                source={require('../assets/studentimageforbooking.png')} 
                style={styles.studentImage}
                resizeMode="cover"
              />
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{studentName}</Text>
                <Text style={styles.date}>{date}</Text>
              </View>
            </View>
            
            <View style={styles.classDetails}>
              <View style={styles.detailRow}>
                <Image 
                  source={require('../assets/timing.png')} 
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.detailText}>{schedule}</Text>
              </View>
              <View style={styles.detailRow}>
                <Image 
                  source={require('../assets/class.png')} 
                  style={styles.icon}
                  resizeMode="contain"
                />
                <Text style={styles.detailText}>{classBookedFor}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Price: </Text>
                <Text style={styles.priceValue}>{price}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  popup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: '100%',
    maxWidth: 350,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 24,
    color: '#666666',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  outerWhiteCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#f4e5e5ff',
    zIndex: 1,
  },
  innerGreenCircle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#9ee4dbff',
    zIndex: 2,
  },
  acceptRejectIcon: {
    width: 107,
    height: 107,
    borderRadius: 53.5,
    zIndex: 10,
  },
  content: {
    marginBottom: 25,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
    borderColor: '#01004C',
    borderWidth: 1,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#16423C',
    fontWeight: '600',
  },
  classDetails: {
    backgroundColor: '#F8F8F8',
    padding: 15,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#16423C',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingActionPopup;