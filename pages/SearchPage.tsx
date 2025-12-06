import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopSubjects from '../components/TopSubjects';
import TutorRecommendation from '../components/TutorRecommendation';
import AiChatBanner from '../components/AiChatBanner';
import PopularCourses from '../components/PopularCourses';
import Categories from '../components/Categories';
import FilterMenu from '../components/FilterMenu';


interface SearchPageProps {
  onBack: () => void;
  userGender?: string;
  userName?: string;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, userGender = 'Male', userName = 'User' }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterSlideAnim] = useState(new Animated.Value(320));

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.length > 0) {
      setIsSearching(true);
      // Simulate search results
      const mockResults = [
        'Mathematics Course',
        'English Literature',
        'Physics Fundamentals',
        'Chemistry Basics',
        'History of Science',
        'Computer Programming',
        'Spanish Language',
        'Biology Essentials'
      ].filter(item => 
        item.toLowerCase().includes(text.toLowerCase())
      );
      setSearchResults(mockResults);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleVoiceSearch = () => {
    if (isRecording) return;
    
    setIsRecording(true);
    console.log('Voice recording started');
    
    // Simulate voice recording with timeout
    const timeout = setTimeout(() => {
      setIsRecording(false);
      console.log('Voice recording stopped');
      
      // Simulate voice-to-text conversion
      const voiceQueries = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Biology'];
      const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)];
      console.log('Voice query:', randomQuery);
      
      // Set the search text and trigger search
      setSearchText(randomQuery);
      handleSearch(randomQuery);
    }, 2000);
    
    // Cleanup function
    return () => clearTimeout(timeout);
  };

  const openFilter = () => {
    setFilterVisible(true);
    filterSlideAnim.setValue(320);
    Animated.timing(filterSlideAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeFilter = () => {
    Animated.timing(filterSlideAnim, {
      toValue: 320,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setFilterVisible(false);
    });
  };

  const renderContent = () => {
    if (isRecording) {
      return (
        <View style={styles.recordingContainer}>
          <Text style={styles.recordingText}>🎤 Listening...</Text>
          <Text style={styles.recordingSubtext}>Speak now</Text>
        </View>
      );
    }
    if (isSearching && searchText.length > 0) {
      return (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>Search Results ({searchResults.length})</Text>
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <TouchableOpacity key={result} style={styles.searchResultItem}>
                <Text style={styles.searchResultText}>{result}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResultsText}>No results found for "{searchText}"</Text>
          )}
        </View>
      );
    }
    return (
      <>
        <TopSubjects />
        <TutorRecommendation />
        <AiChatBanner />
        <PopularCourses />
        <Categories />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Filter Section */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterButton} onPress={openFilter}>
          <View style={styles.filterIcon}>
            <View style={[styles.filterLine, { width: '100%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '80%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '60%', alignSelf: 'center' }]} />
            <View style={[styles.filterLine, { width: '40%', alignSelf: 'center' }]} />
          </View>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchInputContainer}>
          <Image 
            source={require('../assets/search.png')} 
            style={styles.searchIconInput}
            resizeMode="contain"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses, tutors, subjects..."
            value={searchText}
            onChangeText={handleSearch}
            autoFocus={true}
          />
          <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceSearch}>
            <Image 
              source={require('../assets/voice.png')} 
              style={[styles.voiceIcon, isRecording && styles.recordingIcon]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
        <View style={styles.spacer} />
      </ScrollView>
      

      
      <FilterMenu 
        visible={filterVisible}
        onClose={closeFilter}
        slideAnim={filterSlideAnim}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  filterSection: {
    backgroundColor: '#16423C',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    alignItems: 'flex-end',
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2FFFA',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    borderWidth: 1,
    borderColor: '#16423C',
  },
  searchIconInput: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    height: '100%',
    textAlignVertical: 'center',
    paddingVertical: 0,
    margin: 0,
  },
  voiceButton: {
    padding: 4,
  },
  voiceIcon: {
    width: 18,
    height: 18,
  },
  recordingIcon: {
    tintColor: '#FF4444',
  },
  recordingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingText: {
    fontSize: 24,
    color: '#16423C',
    marginBottom: 10,
  },
  recordingSubtext: {
    fontSize: 16,
    color: '#666666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 30,
  },
  filterIcon: {
    width: 16,
    height: 12,
    justifyContent: 'space-between',
    marginRight: 6,
  },
  filterLine: {
    height: 2,
    backgroundColor: '#16423C',
    borderRadius: 1,
  },
  filterText: {
    fontSize: 14,
    color: '#16423C',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  searchResultsContainer: {
    padding: 20,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  searchResultItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchResultText: {
    fontSize: 16,
    color: '#333333',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
  spacer: {
    height: 30,
  },
});

export default SearchPage;