import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    // Implement your sign-in logic here
    // For example:
    try {
      setLoading(true);
      const response = await axios.post("https://budgetfoods.onrender.com/sign-in", {
        email,
        password,
      });
      setLoading(false);
      if (response.data.key === 1) {
        // Handle successful sign-in, for example, navigate to a new screen
        navigation.navigate("home", { user: email});
      } else {
        // Handle sign-in failure, show an alert or error message
        Alert.alert("Sign-in failed", "Invalid email or password");
      }
    } catch (error) {
      setLoading(false);
      console.error("Sign-in error:", error);
      Alert.alert("Error", "An error occurred while signing in. Please try again later.");
    }
  };

  const handleLogin = async() => {
    console.log("handle login pressed");
    navigation.navigate('login');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#0056b3" : "#007bff" },
          ]}
          onPress={handleSignIn}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", textAlign: "center" }}>Sign In</Text>
          )}
        </Pressable>
      </View>
      <Text style={styles.forgotPassword}>Forgot Password?</Text>
      <Pressable onPress={handleLogin}><View style={styles.button}><Text style={{textAlign:'center'}}>sign-up</Text></View></Pressable>
      {/* Add your sign-up button here if necessary */}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Signin;
