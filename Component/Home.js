import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigation from './Navigation';

const Home = ({ route, navigation }) => {
  const [foodlist, setFoodlist] = useState([]);
  const user = route.params.user;

  useEffect(() => {
    renderFoodlist();
    console.log("home user is ", user);
  }, []);

  const renderFoodlist = async () => {
    try {
      const response = await axios.get('https://budgetfoods.onrender.com/foodlist');
      setFoodlist(response.data.foodlist);
    } catch (error) {
      console.log("Error fetching foodlist:", error.message);
    }
  };

  const renderFoodListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        navigation.navigate('details', { item: item,  user:user });
        console.log("item is ", item);
      }}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
    </TouchableOpacity>
  );
  
  const handleLogOut = async() => {
    await AsyncStorage.removeItem('user');
    navigation.navigate('login');
    console.log("user removed successfully");
  }

  return (
    <View style={styles.homeMainContainer}>
      <View>
        <Text>Top container with search bar</Text>
      </View>
      <View>
        <Text>Middle container with deals</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => handleLogOut()} >
          <Text>log out</Text>
        </TouchableOpacity>
      <View>
        <FlatList
          data={foodlist}
          keyExtractor={(item) => item.name}
          renderItem={renderFoodListItem}
        />
      </View>
      <View>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("cart", { user: user })} >
          <Text>Cart</Text>
        </TouchableOpacity>
      </View>
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  homeMainContainer: {
    width: "100%",
  },
  backButton: {
    margin:5,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  listItem: {
    // Add styling for your list items
    margin: 10,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  itemName: {
    // Add styling for item name
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDescription: {
    // Add styling for item description
    fontSize: 16,
  },
});

export default Home;
