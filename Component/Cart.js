import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const Cart = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [updateState, setUpdateState] = useState(0);
  const email = route.params.user;

  useEffect(() => {
    handleAddToCart();
  }, []);

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total.toFixed(2); // Assuming you want to display the total with two decimal places
  };

  //changes made until i go back to home are just in frontend so changes will be made to the backend
  const updateCart = async () => {
    console.log("cart items is this ", cartItems);
    try {
      navigation.navigate("home", { user: email });
      const response = await axios.get(
        `https://budgetfoods.onrender.com/cart?email=${encodeURIComponent(
          email
        )}`
      );
      const items = response.data.foodlist.items;

      if (items != cartItems) {
        await axios.post(
          "https://budgetfoods.onrender.com/update-cart-quantity",
          {
            email,
            cartItems,
          }
        );
      }
    } catch (error) {
      console.log("Error fetching cart items:", error.message);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.get(
        `https://budgetfoods.onrender.com/cart?email=${encodeURIComponent(
          email
        )}`
      );
      const items = response.data.foodlist.items;
      setCartItems(items);
    } catch (error) {
      console.log("Error fetching cart items:", error.message);
    }
  };

  const handleRemoveFromCart = async (item) => {
    // Remove the item from the cart
    await axios.post("https://budgetfoods.onrender.com/remove-cart-item", {
      email,
      item,
    });
    setUpdateState((prevState) => prevState + 1);
    handleAddToCart();
  };

  const handleIncreaseQuantity = (item) => {
    setCartItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.name === item.name
          ? { ...prevItem, quantity: prevItem.quantity + 1 }
          : prevItem
      )
    );
  };

  const handleDecreaseQuantity = (item) => {
    setCartItems((prevItems) =>
      prevItems.map((prevItem) =>
        prevItem.name === item.name && prevItem.quantity > 1
          ? { ...prevItem, quantity: prevItem.quantity - 1 }
          : prevItem
      )
    );
  };

  const handleOrder = async () => {
    try {
      // Calculate the total price
      const totalAmount = calculateTotalPrice();
  
      // Prepare the order payload
      const orderPayload = {
        email,
        items: cartItems,
        totalAmount,
        // Add any other relevant information for the order
      };
  
      // Send the order request
      const response = await axios.post('https://budgetfoods.onrender.com/order', orderPayload);
  
      // Handle the response, you can navigate to a confirmation page or perform other actions
      //console.log('Order placed successfully:', response.data);
      if(response.data.orderId)
      {
        Alert.alert("order placed");
        navigation.navigate("orders", {user:email})
      }
      else{
        Alert.alert("order was not placed please try again later");
      }
  
      // Optionally, you can clear the cart or perform other actions
      // Clear the cart: setCartItems([]);
    } catch (error) {
      console.error('Error placing the order:', error.message);
      // Handle the error, show a message to the user, or perform other actions
    }
  };
  

  return (
    <View style={styles.cartContainer} key={updateState}>
      <Text style={styles.cartTitle}>Shopping Cart</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => updateCart()}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("orders",{user:email})}>
        <Text style={styles.backButtonText}>Previous orders</Text>
      </TouchableOpacity>
     {/* also add clear cart to remove all the elements from the cart*/}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text>{item.name}</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleDecreaseQuantity(item)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleIncreaseQuantity(item)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleRemoveFromCart(item)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalAmount}>${calculateTotalPrice()}</Text>
      </View>

      <TouchableOpacity style={styles.buyNowButton} onPress={handleOrder}>
        <Text style={styles.buyNowButtonText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    padding: 20,
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buyNowButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buyNowButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    marginTop:5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color:"#fff",
  },
  cartItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  removeButton: {
    color: "red",
    fontWeight: "bold",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    backgroundColor: "#007bff",
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    color: "#4CAF50", // Green color for the total amount
  },
});

export default Cart;
