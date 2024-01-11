import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import Navigation from "./Navigation";

const Orders = ({ navigation, route }) => {
  const email = route.params.user;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://budgetfoods.onrender.com/orders?email=${encodeURIComponent(
          email
        )}`
      );
      setOrders(response.data.orders);
      console.log("recent orders are ", response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const renderOrderCard = ({ item }) => {
    return (
      <View style={styles.orderCard}>
        <Text>Total Price: ${item.totalPrice}</Text>
        <Text>Items: {renderOrderedItems(item.items)}</Text>
        {/* Add more details from the order schema as needed */}
      </View>
    );
  };

  const renderOrderedItems = (items) => {
    return items.map((item) => (
      <Text key={item.food._id}>
        {item.food.name} - Quantity: {item.quantity}
      </Text>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.ordersTitle}>Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        renderItem={renderOrderCard}
      />
      <Navigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderCard: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default Orders;
