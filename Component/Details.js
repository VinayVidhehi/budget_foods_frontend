import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Navigation from './Navigation';

const Details = ({ route, navigation }) => {
  const item = route.params.item;
  const email = route.params.user  //email === user

  const handleAddToCart = async() => {

    // Send the details to the Cart component
    const response = await axios.post('https://budgetfoods.onrender.com/update-cart', {
      item,
      email
    })

    Alert.alert(response.data.message);

  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      {/* Add more details as needed */}
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
     <View>
     <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('cart', {user:email})}>
        <Text style={styles.backButtonText}>go to cart</Text>
      </TouchableOpacity>
     </View>
     <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    margin:10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Details;
