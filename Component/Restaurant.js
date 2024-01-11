import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import CheckBox from "./Checkbox";

const Restaurant = ({ route, navigation }) => {
  const [chooseOperation, setChooseOperation] = useState(9);
  const [restaurantName, setRestaurantName] = useState("");
  const [foodItem, setFoodItem] = useState({
    name: "",
    description: "",
    category: "",
    price: 0,
    ingredients: [],
    allergens: [],
    calories: 0,
    image: "",
    origin: "",
  });
  //const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    handleUpdateRestaurant();
    fetchOrders();
  }, []);

  const handleUpdateRestaurant = async () => {
    ///console.log("user saved is ", route.params.user);
    setRestaurantName(route.params.user.restaurantName);
  };

  const handleInputChange = (key, value) => {
    setFoodItem({ ...foodItem, [key]: value });
  };

  const handleCheckboxChange = (key) => {
    setFoodItem({ ...foodItem, [key]: !foodItem[key] });
  };

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("res-cred");
    console.log("log out successfull");
    navigation.navigate("login");
  };

  const handleUpdateItem = async () => {
    try {
      // Assuming you have an API endpoint for updating the food list
      handleInputChange("restaurantName", restaurantName);
      const response = await axios.post(
        "https://budgetfoods.onrender.com/update-fooditem",
        { foodItem }
      );
      console.log(response.data);
      // Optionally, you can reset the form or perform other actions after successful upload
    } catch (error) {
      console.error("Error updating food item:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      // Assuming you have an API endpoint for updating the food list
      handleInputChange("restaurantName", restaurantName);
      console.log(
        "restaurant name is ",
        restaurantName,
        foodItem.restaurantName
      );
      const response = await axios.post(
        "https://budgetfoods.onrender.com/add-fooditem",
        {
          foodItem,
        }
      );
      console.log(response.data);
      // Optionally, you can reset the form or perform other actions after successful upload
    } catch (error) {
      console.error("Error adding food item:", error);
    }
  };

  const handleDeleteItem = async () => {
    try {
      // Assuming you have an API endpoint for deleting a food item
      handleInputChange("restaurantName", restaurantName);
      const response = await axios.delete(
        "https://budgetfoods.onrender.com/delete-fooditem",
        { fooditem }
      );
      console.log(response.data);
      // Optionally, you can reset the form or perform other actions after successful delete
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `https://budgetfoods.onrender.com/orders?restaurantName=${encodeURIComponent(
          restaurantName
        )}`
      );
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const renderOrderCard = ({ item }) => {
    return (
      <View style={styles.orderCard}>
        <Text>Email: {item.email}</Text>
        <Text>Total Price: ${item.totalPrice}</Text>
        {/* Add more details from the order schema as needed */}
      </View>
    );
  };

  const renderMenu = () => {
    return (
      <Modal
        transparent={true}
        animationType="slide"
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menu</Text>
            <TouchableOpacity onPress={() => setChooseOperation(0)}>
              <Text>Add Item</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseOperation(1)}>
              <Text>Update Item</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setChooseOperation(2)}>
              <Text>Delete Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsMenuVisible(false);
                setChooseOperation(5);
              }}
            >
              <Text>Close Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View>
      <View>
        <Text>{restaurantName}</Text>
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handleLogOut()}
      >
        <Text style={{ color: "#fff" }}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          Alert.alert("updating items now");
          setChooseOperation(3);
        }}
      >
        <Text style={{ color: "#fff" }}>Update items</Text>
      </TouchableOpacity>

      {chooseOperation > 3 && (
        <View style={styles.ordersContainer}>
          <Text style={styles.ordersTitle}>Orders</Text>
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderOrderCard}
          />
        </View>
      )}

      {chooseOperation == 3 && (
        <View>
          <Text>update items here</Text>
          <View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setChooseOperation(0)}
            >
              <Text style={{ color: "#fff" }}>add items</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setChooseOperation(1)}
            >
              <Text style={{ color: "#fff" }}>update item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setChooseOperation(2)}
            >
              <Text style={{ color: "#fff" }}>delete item</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {chooseOperation === 0 && (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setChooseOperation(3)}
          >
            <Text style={{ color: "#fff" }}>back</Text>
          </TouchableOpacity>
          <Text>enter the details of the item to be added to the app</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) => handleInputChange("description", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            onChangeText={(text) => handleInputChange("category", text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("price", parseFloat(text))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Ingredients (comma-separated)"
            onChangeText={(text) =>
              handleInputChange("ingredients", text.split(","))
            }
          />

          <View style={styles.checkbox}>
            <CheckBox
              value={foodItem.allergens.includes("Dairy")}
              onValueChange={() => handleCheckboxChange("Dairy")}
            />
            <Text>Contains Dairy</Text>
          </View>
          <Pressable style={styles.button} onPress={handleAddItem}>
            <Text style={{ color: "#fff", textAlign: "center" }}>Add Item</Text>
          </Pressable>
        </View>
      )}

      {chooseOperation === 1 && (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setChooseOperation(3)}
          >
            <Text style={{ color: "#fff" }}>back</Text>
          </TouchableOpacity>
          <Text>Enter the item to be deleted</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <Pressable style={styles.button} onPress={handleUpdateItem}>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Update Item
            </Text>
          </Pressable>
        </View>
      )}

      {chooseOperation === 2 && (
        <View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setChooseOperation(3)}
          >
            <Text style={{ color: "#fff" }}>back</Text>
          </TouchableOpacity>
          <Text>Enter the name of the item to be deleted</Text>
          <TextInput
            style={styles.input}
            placeholder="Name of Item to Delete"
            onChangeText={(text) => handleInputChange("name", text)}
          />
          <Pressable style={styles.button} onPress={handleDeleteItem}>
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Delete Item
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  logOutButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  menuButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "#fff",
  },
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  checkbox: {
    marginBottom: 10,
  },
  backButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  menuButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  ordersContainer: {
    marginVertical: 20,
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

export default Restaurant;

//cart should display total amount
//ask for address when accepting the order
//order details should be present in the icon
/*
logOutButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  menuButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "flex-end",
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
    marginBottom: 10,
  },
  closeButtonText: {
    color: "#fff",
  },
  container: {
    padding: 20,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  checkbox: {
    marginBottom: 10,
  },
  backButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
*/

//order size and cross check if they are ordering the same or make the cart empty
