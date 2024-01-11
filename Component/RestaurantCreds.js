import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const RestaurantCred = ({ route, navigation }) => {
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddress, setRestaurantAddress] = useState("");

  useEffect(() => {
    handleRestaurantCredentials();
  }, []);

  const handleRestaurantCredentials = async() => {
    //console.log("user", route.params.user)
    const resUser = await axios.get( `https://budgetfoods.onrender.com/restaurant-cred?email=${encodeURIComponent(
      route.params.user,
    )}`)
    if(resUser.data.key) {
      //console.log(resUser.data.credentials);
      navigation.navigate("restaurant", {user: resUser.data.credentials});
    }
  };

  const handleSaveCredentials = async () => {
    try {
      // Assuming you have an API endpoint for saving restaurant credentials

      const resUser = {
        restaurantName: restaurantName,
        address: restaurantAddress,
        email: route.params.user,
      };

      console.log("restaurantName", resUser);
      await axios.post(
        "https://budgetfoods.onrender.com/restaurant-cred",
        {
          resUser,
        }
      );

      //await AsyncStorage.setItem("res-cred", JSON.stringify(resUser));
      const user = {
        email: route.params.email,
        restaurantName: restaurantName,
      }
      navigation.navigate("restaurant", {
        user,
      });
      // Optionally, you can perform other actions after successful save
    } catch (error) {
      console.error("Error saving restaurant credentials:", error);
    }
  };

  const handleLogOut = async () => {
    await AsyncStorage.removeItem("user");
    navigation.navigate("login");
    console.log("user removed successfully");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => handleLogOut()}
      >
        <Text style={{ color: "#fff" }}>log out</Text>
      </TouchableOpacity>
      <Text>Restaurant Name</Text>
      <TextInput
        style={styles.input}
        value={restaurantName}
        onChangeText={(text) => setRestaurantName(text)}
      />

      <Text>Restaurant Address</Text>
      <TextInput
        style={styles.input}
        value={restaurantAddress}
        onChangeText={(text) => setRestaurantAddress(text)}
      />

      <Pressable style={styles.button} onPress={handleSaveCredentials}>
        <Text style={{ color: "#fff" }}>Save Credentials</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  backButton: {
    margin: 5,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
});

export default RestaurantCred;
