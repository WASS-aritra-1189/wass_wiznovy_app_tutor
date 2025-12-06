import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import BookingCard from './BookingCard';
import BookingActionPopup from './BookingActionPopup';
import { sessionsService, TutorSession } from '../services/sessionsService';

const BookingsList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sessions, setSessions] = useState<TutorSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const getBookingType = (dateString: string) => {
    const today = new Date();
    const bookingDate = new Date(dateString);
    
    const todayStr = today.toDateString();
    const bookingStr = bookingDate.toDateString();
    
    if (bookingStr === todayStr) {
      return 'Today';
    } else if (bookingDate > today) {
      return 'Upcoming';
    } else {
      return 'Past';
    }
  };

  const getClassStatus = (dateString: string, startTime: string, endTime: string) => {
    const now = new Date();
    const classDate = new Date(dateString);
    
    // Parse start time (format: "09:15:00")
    const [startHours, startMinutes] = startTime.split(':');
    const classStartTime = new Date(classDate);
    classStartTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);
    
    // Parse end time (format: "10:15:00")
    const [endHours, endMinutes] = endTime.split(':');
    const classEndTime = new Date(classDate);
    classEndTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);
    
    if (now > classEndTime) {
      return 'Ended';
    } else if (now >= classStartTime && now <= classEndTime) {
      return 'Ongoing';
    } else {
      return 'Next';
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const fetchSessions = async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionsService.getTutorSessions(100, 0, date);
      setSessions(response.result);
    } catch (err) {
      setError('Failed to load sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    if (activeFilter === 'Past') {
      for (let i = 7; i >= 1; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    } else if (activeFilter === 'Today') {
      dates.push({
        value: today.toISOString().split('T')[0],
        label: 'Today'
      });
    } else if (activeFilter === 'Upcoming') {
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    }
    
    return dates;
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchSessions(today);
  }, []);

  useEffect(() => {
    const dates = generateDateOptions();
    if (dates.length > 0) {
      setSelectedDate(dates[0].value);
      fetchSessions(dates[0].value);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchSessions(selectedDate);
  }, [selectedDate]);
  
  const bookingsData = sessions.map(session => ({
    id: session.id,
    studentName: session.user.userDetail.name,
    schedule: `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`,
    classBookedFor: session.notes || 'Tutoring Session',
    date: session.sessionDate,
    price: `$${session.amount}`,
    type: getBookingType(session.sessionDate),
    status: session.status,
    startTime: session.startTime,
    endTime: session.endTime
  }));

  const dateOptions = generateDateOptions();

  const handleBookingPress = (booking: any) => {
    setSelectedBooking(booking);
    setPopupVisible(true);
  };

  const handleAccept = () => {
    console.log('Accepted booking:', selectedBooking?.id);
    setPopupVisible(false);
    setSelectedBooking(null);
  };

  const handleReject = () => {
    console.log('Rejected booking:', selectedBooking?.id);
    setPopupVisible(false);
    setSelectedBooking(null);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedBooking(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16423C" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchSessions(selectedDate)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.sessionsContainer}
        contentContainerStyle={styles.sessionsContent}
      >
        {bookingsData.length > 0 ? (
          bookingsData.map((booking) => (
            <BookingCard
              key={booking.id}
              studentName={booking.studentName}
              schedule={booking.schedule}
              classBookedFor={booking.classBookedFor}
              date={new Date(booking.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
              status={getClassStatus(booking.date, booking.startTime, booking.endTime)}
              price={booking.price}
              onPress={() => handleBookingPress(booking)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions found for selected date</Text>
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        {['Today', 'Upcoming', 'Past'].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              activeFilter === filter && styles.activeFilterText
            ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.dateSelector}
        contentContainerStyle={styles.dateSelectorContent}
      >
        {dateOptions.map((date, index) => (
          <TouchableOpacity
            key={date.value}
            style={[
              styles.dateButton,
              selectedDate === date.value && styles.activeDateButton,
              index === 0 && styles.firstDateButton,
              index === dateOptions.length - 1 && styles.lastDateButton
            ]}
            onPress={() => setSelectedDate(date.value)}
          >
            <Text style={[
              styles.dateText,
              selectedDate === date.value && styles.activeDateText
            ]}>
              {date.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {renderContent()}
      
      {selectedBooking && (
        <BookingActionPopup
          visible={popupVisible}
          onClose={handleClosePopup}
          onAccept={handleAccept}
          onReject={handleReject}
          studentName={selectedBooking.studentName}
          schedule={selectedBooking.schedule}
          classBookedFor={selectedBooking.classBookedFor}
          date={new Date(selectedBooking.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })}
          price={selectedBooking.price}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#16423C',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  dateSelector: {
    marginBottom: 20,
    maxHeight: 50,
  },
  dateSelectorContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  firstDateButton: {
    marginLeft: 0,
  },
  lastDateButton: {
    marginRight: 20,
  },
  activeDateButton: {
    backgroundColor: '#16423C',
    borderColor: '#16423C',
    shadowColor: '#16423C',
    shadowOpacity: 0.3,
    elevation: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'center',
  },
  activeDateText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sessionsContainer: {
    flex: 1,
  },
  sessionsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#16423C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default BookingsList;