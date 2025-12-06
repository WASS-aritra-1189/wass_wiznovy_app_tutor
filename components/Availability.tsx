import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface AvailabilityProps {
  onDayPress?: (day: string) => void;
  onTimePress?: (time: string) => void;
}

const Availability: React.FC<AvailabilityProps> = ({ onDayPress, onTimePress }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Availability</Text>
      {/* Days Row - Scrollable */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.daysScrollView}
        contentContainerStyle={styles.daysContainer}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.dayButton, selectedDay === day && styles.selectedButton]}
            onPress={() => {
              setSelectedDay(day);
              onDayPress?.(day);
            }}
          >
            <Text style={[styles.dayText, selectedDay === day && styles.selectedText]}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Buttons - 4 in a row, 2 rows */}
      <View style={styles.timeContainer}>
        <View style={styles.timeRow}>
          {times.slice(0, 4).map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
              onPress={() => {
                setSelectedTime(time);
                onTimePress?.(time);
              }}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.timeRow}>
          {times.slice(4, 8).map((time) => (
            <TouchableOpacity
              key={time}
              style={[styles.timeButton, selectedTime === time && styles.selectedButton]}
              onPress={() => {
                setSelectedTime(time);
                onTimePress?.(time);
              }}
            >
              <Text style={[styles.timeText, selectedTime === time && styles.selectedText]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 388,
    height: 200,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
    marginBottom: 12,
  },
  daysScrollView: {
    marginBottom: 0,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayButton: {
    width: 79.47,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F8F8',
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
  },
  dayText: {
    fontSize: 12,
    color: '#01004C',
    fontWeight: '500',
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeButton: {
    width: 79.47,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F8F8F8',
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 8,
  },
  timeText: {
    fontSize: 10,
    color: '#01004C',
    fontWeight: '500',
  },
  selectedButton: {
    backgroundColor: '#01004C',
  },
  selectedText: {
    color: '#FFFFFF',
  },
});

export default Availability;