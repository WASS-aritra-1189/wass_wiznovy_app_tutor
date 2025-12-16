import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  Dimensions,
  ViewToken,
  
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import SkipButton from '../components/SkipButton';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { getWalkthrough } from '../services/profileService';

const { width, height } = Dimensions.get('window');

// Import your local images - adjust paths according to your assets folder structure
const slide1Image = require('../assets/walkthrough1.png');
const slide2Image = require('../assets/walkthrough2.png');
const slide3Image = require('../assets/walkthrough3.png');

interface SlideItem {
  id: string;
  title: string | null;
  subtitle: string;
  image: string | null;
  imagePath: string | null;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
}

interface WalkthroughScreenProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

interface FooterProps {
  slides: SlideItem[];
  currentSlide: number;
  handleSkip: () => void;
  goToNextSlide: () => void;
}

interface SlideProps {
  item: SlideItem;
  slides: SlideItem[];
}

const Slide: React.FC<SlideProps> = ({ item, slides }) => {
  const getImageSource = () => {
    if (item.image) {
      return { uri: item.image };
    } else if (item.imagePath) {
      return { uri: item.imagePath };
    }
    // Fallback to default images based on index
    const index = slides.findIndex(slide => slide.id === item.id);
    const defaultImages = [slide1Image, slide2Image, slide3Image];
    return defaultImages[index] || slide1Image;
  };

  return (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image
          source={getImageSource()}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title || 'Walkthrough Screen'}</Text>
        
        <Text style={styles.mainDescription}>
          {item.subtitle || 'Learn how to use this feature'}
        </Text>
      </View>
    </View>
  );
};

const Footer: React.FC<FooterProps> = ({ slides, currentSlide, handleSkip, goToNextSlide }) => {
  return (
    <View style={styles.footer}>
      {/* Pagination */}
      <View style={styles.pagination}>
        {slides.map((slide, index) => (
          <View
            key={`pagination-${slide.id}`}
            style={[
              styles.paginationDot,
              currentSlide === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <SkipButton
          title="SKIP"
          onPress={handleSkip}
        />
        
        <Button
          title={currentSlide === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
          onPress={goToNextSlide}
          variant="primary"
        />
      </View>
    </View>
  );
};

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ 
  onComplete, 
  onSkip 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  React.useEffect(() => {
    fetchWalkthroughData();
  }, []);

  const fetchWalkthroughData = async () => {
    try {
      console.log('Fetching walkthrough data...');
      const result = await getWalkthrough();
      console.log('Walkthrough API result:', result);
      
      if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
        console.log('Using API data:', result.data);
        setSlides(result.data);
      } else {
        console.log('API failed or no data, using defaults');
        setSlides(defaultSlides);
      }
    } catch (error) {
      console.error('Failed to fetch walkthrough data:', error);
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
    }
  };

  const defaultSlides: SlideItem[] = [
    {
      id: '1',
      title: 'Walkthrough Screen',
      subtitle: 'ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      image: null,
      imagePath: null,
    },
    {
      id: '2',
      title: 'Walkthrough Screen',
      subtitle: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      image: null,
      imagePath: null,
    },
    {
      id: '3',
      title: 'Walkthrough Screen',
      subtitle: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      image: null,
      imagePath: null,
    },
  ];



  const goToNextSlide = (): void => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
      setCurrentSlide(nextSlide);
    } else {
      onComplete?.();
    }
  };

  const handleSkip = (): void => {
    onSkip?.();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsChanged) => {
    if (viewableItems[0]) {
      setCurrentSlide(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;



  return (
    <SafeAreaWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      


      {/* FlatList for Slides */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={({ item }) => <Slide item={item} slides={slides} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
        />
      )}

      <Footer 
        slides={slides}
        currentSlide={currentSlide}
        handleSkip={handleSkip}
        goToNextSlide={goToNextSlide}
      />
      </SafeAreaView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  slide: {
    width: width - 40,
    marginHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  imageContainer: {
    width: width * 0.9,
    height: height * 0.6,
    marginTop: 40,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
    paddingHorizontal: 0,
    marginTop: 20,
  },
  description: {
    fontSize: 22,
    color: '#140101ff',
    textAlign: 'left',
    marginBottom: 30,
    lineHeight: 22,
    fontWeight: 'bold',
    paddingHorizontal: 0,
  },
  mainDescription: {
    fontSize: 14,
    color: '#01004C',
    textAlign: 'left',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 30,
  },
  footer: {
    height: height * 0.15,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DDD',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#16423c',
    width: 20,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  brand: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default WalkthroughScreen;