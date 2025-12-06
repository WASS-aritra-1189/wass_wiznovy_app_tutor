import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';

interface CategoriesProps {
  navigation?: any;
}

const Categories: React.FC<CategoriesProps> = ({ navigation }) => {
  return (
    <View style={styles.categoriesContainer}>
      <View style={styles.categoriesHeader}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesGrid}>
        <TouchableOpacity 
          style={styles.categoryItem}
          activeOpacity={0.7}
          onPress={() => {
            navigation?.navigate('CategorySubjects', {
              categoryMainImage: 'https://via.placeholder.com/150',
              tutors: [
                { id: '1', image: require('../assets/englih.png'), title: 'English Expert', expertCount: '29k' },
                { id: '2', image: require('../assets/panih.png'), title: 'Spanish Tutor', expertCount: '15k' },
                { id: '3', image: require('../assets/canada.png'), title: 'French Teacher', expertCount: '22k' },
                { id: '4', image: require('../assets/englih.png'), title: 'Literature Prof', expertCount: '18k' },
                { id: '5', image: require('../assets/panih.png'), title: 'Grammar Expert', expertCount: '31k' },
                { id: '6', image: require('../assets/canada.png'), title: 'Writing Tutor', expertCount: '25k' },
                { id: '7', image: require('../assets/englih.png'), title: 'Reading Teacher', expertCount: '20k' },
                { id: '8', image: require('../assets/panih.png'), title: 'Vocabulary Prof', expertCount: '12k' },
                { id: '9', image: require('../assets/canada.png'), title: 'Communication', expertCount: '8k' },
              ]
            });
          }}
        >
          <View style={styles.categoryIconContainer}>
            <Image 
              source={require('../assets/subjects.png')} 
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.categoryText}>Subjects</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
          <View style={styles.categoryIconContainer}>
            <Image 
              source={require('../assets/Daily Task.png')} 
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.categoryText}>Daily Task</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
          <View style={styles.categoryIconContainer}>
            <Image 
              source={require('../assets/help.png')} 
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.categoryText}>Help</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
          <View style={styles.categoryIconContainer}>
            <Image 
              source={require('../assets/progress.png')} 
              style={styles.categoryIcon}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.categoryText}>Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    backgroundColor: '#F2FFFA',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    alignSelf: 'center',
    width: '90%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#9d9595ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 9,
    borderColor:'#E4E4E4',
    borderWidth:1,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16423C',
  },
  viewAllButton: {
    fontFamily: 'Poppins',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 15,
    letterSpacing: 0,
    color: '#16423C',
  },
  categoriesGrid: {
    flexDirection: 'row',
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FDFDFD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#16423C63',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryText: {
    fontSize: 11,
    color: '#16423C',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Categories;