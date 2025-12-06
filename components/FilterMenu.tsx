import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';

interface FilterMenuProps {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
}

const FilterMenu: React.FC<FilterMenuProps> = ({ visible, onClose, slideAnim }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [minSliderPosition, setMinSliderPosition] = useState(0);
  const [maxSliderPosition, setMaxSliderPosition] = useState(204);
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: boolean}>({});
  const trackWidth = 230;
  const thumbWidth = 12;

  const toggleFilter = (filterKey: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const handleMinSliderMove = (position: number) => {
    const clampedPosition = Math.max(0, Math.min(position, maxSliderPosition - 20));
    setMinSliderPosition(clampedPosition);
    setMinPrice(Math.round((clampedPosition / (trackWidth - thumbWidth)) * 500));
  };

  const handleMaxSliderMove = (position: number) => {
    const clampedPosition = Math.max(minSliderPosition + 20, Math.min(position, trackWidth - thumbWidth));
    setMaxSliderPosition(clampedPosition);
    setMaxPrice(Math.round((clampedPosition / (trackWidth - thumbWidth)) * 500));
  };

  const minPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = minSliderPosition + gestureState.dx;
        handleMinSliderMove(newPosition);
      },
    })
  ).current;

  const maxPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = maxSliderPosition + gestureState.dx;
        handleMaxSliderMove(newPosition);
      },
    })
  ).current;
  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.filterModalOverlay}>
        <TouchableOpacity 
          style={styles.filterModalBackground}
          onPress={onClose}
          activeOpacity={1}
        />
        <Animated.View style={[styles.filterMenuContainer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterHeaderTitle}> Apply Filter Now</Text>
            <TouchableOpacity onPress={onClose} style={styles.filterCloseButton}>
              <Text style={styles.filterCloseText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.filterSection}>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceRangeTitleInside}>Price Range</Text>
                {/* <View style={styles.priceLabels}>
                  <Text style={styles.priceLabel}>Min: ${minPrice}</Text>
                  <Text style={styles.priceLabel}>Max: ${maxPrice}</Text>
                </View> */}
                
                <View style={styles.sliderContainer}>
                  <View style={styles.sliderTrack} />
                  <View style={[styles.sliderRange, {
                    left: minSliderPosition,
                    width: maxSliderPosition - minSliderPosition + thumbWidth
                  }]} />
                  
                  <View
                    {...minPanResponder.panHandlers}
                    style={[styles.sliderThumb, { left: minSliderPosition }]}
                  />
                  
                  <View
                    {...maxPanResponder.panHandlers}
                    style={[styles.sliderThumb, { left: maxSliderPosition }]}
                  />
                  
                  <View style={[styles.priceButton, { left: minSliderPosition - 8 }]}>
                    <Text style={styles.priceButtonText}>${minPrice}</Text>
                  </View>
                  
                  <View style={[styles.priceButton, { left: maxSliderPosition - 8 }]}>
                    <Text style={styles.priceButtonText}>${maxPrice}</Text>
                  </View>
                  

                </View>
                
                {/* <View style={styles.priceRangeLabels}>
                  <Text style={styles.rangeLabel}>$0</Text>
                  <Text style={styles.rangeLabel}>$500</Text>
                </View> */}
              </View>
            </View>
            
            {/* Expertise Level */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Expertise Level</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('beginner')}>
                  <View style={[styles.checkbox, selectedFilters['beginner'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Beginner</Text>
                  <Text style={styles.filterCount}>24</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('intermediate')}>
                  <View style={[styles.checkbox, selectedFilters['intermediate'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Intermediate</Text>
                  <Text style={styles.filterCount}>18</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('advanced')}>
                  <View style={[styles.checkbox, selectedFilters['advanced'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Advanced</Text>
                  <Text style={styles.filterCount}>12</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Rating and Review */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Rating and Review</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('4stars')}>
                  <View style={[styles.checkbox, selectedFilters['4stars'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>4+ Stars</Text>
                  <Text style={styles.filterCount}>32</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('3stars')}>
                  <View style={[styles.checkbox, selectedFilters['3stars'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>3+ Stars</Text>
                  <Text style={styles.filterCount}>45</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('2stars')}>
                  <View style={[styles.checkbox, selectedFilters['2stars'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>2+ Stars</Text>
                  <Text style={styles.filterCount}>52</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Skills */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Skills</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('mathematics')}>
                  <View style={[styles.checkbox, selectedFilters['mathematics'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Mathematics</Text>
                  <Text style={styles.filterCount}>28</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('physics')}>
                  <View style={[styles.checkbox, selectedFilters['physics'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Physics</Text>
                  <Text style={styles.filterCount}>15</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('chemistry')}>
                  <View style={[styles.checkbox, selectedFilters['chemistry'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>Chemistry</Text>
                  <Text style={styles.filterCount}>19</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Country */}
            <View style={styles.filterSection}>
              <View style={styles.filterOptions}>
                <TouchableOpacity style={styles.filterSectionHeader}>
                  <Text style={styles.filterSectionTitle}>Country</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('usa')}>
                  <View style={[styles.checkbox, selectedFilters['usa'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>USA</Text>
                  <Text style={styles.filterCount}>35</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('uk')}>
                  <View style={[styles.checkbox, selectedFilters['uk'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>UK</Text>
                  <Text style={styles.filterCount}>22</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterOption} onPress={() => toggleFilter('india')}>
                  <View style={[styles.checkbox, selectedFilters['india'] && styles.checkboxChecked]} />
                  <Text style={styles.filterOptionText}>India</Text>
                  <Text style={styles.filterCount}>41</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          
          {/* Filter Buttons */}
          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filter</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '20%',
  },
  filterMenuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#C4DAD2',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    overflow: 'hidden',
  },
  filterHeader: {
    backgroundColor: '#C4DAD2',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterHeaderTitle: {
    color: '#16423c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCloseText: {
    color: '#0c0000ff',
    fontSize: 30,
    fontWeight: '200',
  },
  filterContent: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 15,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 0,
  },
  filterOptions: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  filterOption: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
  },
  filterCount: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  filterButtons: {
    flexDirection: 'column',
    padding: 20,
    paddingBottom: 50,
    gap: 15,
    backgroundColor: '#C4DAD2',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  priceRangeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  priceRangeTitleInside: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16423C',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  sliderTrack: {
    height: 11,
    backgroundColor: '#E0E0E0',
    borderRadius: 19,
    width: 230,
    position: 'absolute',
    top: 14.5,
    opacity: 0.4,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  sliderRange: {
    position: 'absolute',
    height: 11,
    backgroundColor: '#16423C',
    borderRadius: 19,
    top: 14.5,
  },
  sliderThumb: {
    position: 'absolute',
    width: 12,
    height: 11,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#16423C',
    top: 14.5,
    opacity: 1,
    zIndex: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  priceRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#666666',
  },
  rangeTracker: {
    position: 'absolute',
    width: 29,
    height: 11,
    backgroundColor: '#16423C',
    borderRadius: 19,
    paddingVertical: 1,
    paddingHorizontal: 8,
    top: 14.5,
    opacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rangeTrackerText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  priceButton: {
    position: 'absolute',
    width: 40,
    height: 22,
    backgroundColor: '#16423C',
    borderRadius: 8,
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceButtonText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  filterSectionHeader: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: '#C4DAD2',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#16423C',
  },
});

export default FilterMenu;