import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  appointmentDates?: number[];
  totalAppointments?: number;
  onMonthChange?: (year: number, month: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, appointmentDates = [], totalAppointments = 0, onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current date
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showYearPicker, setShowYearPicker] = useState(false);

  // Notify parent of initial month when component mounts
  React.useEffect(() => {
    if (onMonthChange) {
      onMonthChange(currentDate.getFullYear(), currentDate.getMonth());
    }
  }, []);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Generate years from present year -80 to present year +80
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 161 }, (_, i) => currentYear - 80 + i);

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const handleDateSelect = (day: number | null) => {
    if (day != null) {
      const newSelectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newSelectedDate);
      if (onDateSelect) {
        onDateSelect(newSelectedDate);
      }
    }
  };

  const isDateSelected = (day: number | null) => {
    if (!day || !selectedDate) return false;
    
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const hasAppointment = (day: number | null) => {
    return day !== null && appointmentDates.includes(day);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      
      // Notify parent about month change
      if (onMonthChange) {
        onMonthChange(newDate.getFullYear(), newDate.getMonth());
      }
      
      return newDate;
    });
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setShowYearPicker(false);
    
    // Notify parent about year change
    if (onMonthChange) {
      onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month);
    setCurrentDate(newDate);
    
    // Notify parent about month change
    if (onMonthChange) {
      onMonthChange(newDate.getFullYear(), newDate.getMonth());
    }
  };

  const formatMonthYear = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation and year picker */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <Text style={styles.navArrow}>{'<'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.monthYearContainer}
          onPress={() => setShowYearPicker(true)}
        >
          <Text style={styles.monthYear}>{formatMonthYear(currentDate)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <Text style={styles.navArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ].map((month, index) => (
            <TouchableOpacity
              key={month}
              style={[
                styles.monthButton,
                currentDate.getMonth() === index && styles.selectedMonthButton
              ]}
              onPress={() => handleMonthSelect(index)}
            >
              <Text style={[
                styles.monthButtonText,
                currentDate.getMonth() === index && styles.selectedMonthButtonText
              ]}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Appointment Count */}
      <View style={styles.appointmentCount}>
        <Text style={styles.appointmentCountText}>
          Total Appointments: {totalAppointments}
        </Text>
      </View>

      {/* Days of week */}
      <View style={styles.daysOfWeek}>
        {daysOfWeek.map(day => (
          <Text key={day} style={styles.dayOfWeekText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              isDateSelected(day) && styles.selectedDayCell,
              hasAppointment(day) && styles.appointmentDayCell
            ]}
            onPress={() => handleDateSelect(day)}
            disabled={!day}
          >
            <Text style={[
              styles.dayText,
              isDateSelected(day) && styles.selectedDayText,
              hasAppointment(day) && styles.appointmentDayText
            ]}>
              {day || ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.yearPickerContainer}>
            <Text style={styles.yearPickerTitle}>Select Year</Text>
            <ScrollView style={styles.yearList}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearButton,
                    currentDate.getFullYear() === year && styles.selectedYearButton
                  ]}
                  onPress={() => handleYearSelect(year)}
                >
                  <Text style={[
                    styles.yearButtonText,
                    currentDate.getFullYear() === year && styles.selectedYearButtonText
                  ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowYearPicker(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    width: 395,
    height: 460,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthYearContainer: {
    flex: 1,
    alignItems: 'center',
  },
  navArrow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#01004C',
  },
  monthSelector: {
    marginBottom: 8,
  },
  appointmentCount: {
    width: 350.5,
    height: 48.2,
    backgroundColor: '#D9D9D9',
    borderRadius: 5,
    opacity: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appointmentCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16423C',
  },
  monthButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
    backgroundColor: '#F8F8F8',
  },
  selectedMonthButton: {
    backgroundColor: '#D9D9D9',
  },
  monthButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#01004C',
  },
  selectedMonthButtonText: {
    color: '#f71414ff',
  },
  daysOfWeek: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#01004C',
    textAlign: 'center',
    flex: 1,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 100% / 7 days
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
    borderRadius: 20, // Circular shape
  },
  selectedDayCell: {
    backgroundColor: '#2e746bff', // Circular background color
  },
  dayText: {
    fontSize: 14,
    color: '#01004C',
    fontWeight: '500',
  },
  selectedDayText: {
    color: '#FFFFFF', // White text for selected date
  },
  appointmentDayCell: {
    backgroundColor: '#799b74ff',
  },
  appointmentDayText: {
    color: '#FFFFFF',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  yearPickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  yearPickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#01004C',
    textAlign: 'center',
    marginBottom: 16,
  },
  yearList: {
    maxHeight: 300,
  },
  yearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  selectedYearButton: {
    backgroundColor: '#16423C',
  },
  yearButtonText: {
    fontSize: 16,
    color: '#01004C',
    textAlign: 'center',
  },
  selectedYearButtonText: {
    color: '#FFFFFF',
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: '#16423C',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Calendar;