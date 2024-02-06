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
import CheckBox from "./Checkbox";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(0);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const checkUser = await AsyncStorage.getItem("user");
    const user = JSON.parse(checkUser);
    console.log("am i here at the user find")
    if (user) {
      if (user.password.startsWith("asdfghjk")) {
        navigation.navigate("restaurant-creds", {user: user.email});
        Alert.alert("Auto-logged in successfully");
      }
      else {
        navigation.navigate("home", { user: user.email });
        Alert.alert("Auto-logged in successfully");
      }
    }
  };

  const handleSignin = async() => {
    console.log("signin clicked");
    navigation.navigate('signin');
  }

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when the request starts

    if (otp === 0) {
      try {
        const response = await axios.post("https://budgetfoods.onrender.com/sign-up", {
          email,
          password,
        });
        console.log("response for email check is", response)
        if (response) {
          if (response.data.key) {
            Alert.alert(
              "User with the provided email already exists, use a different email"
            );
          } else {
            setOtp(1);
            Alert.alert("Please enter the OTP sent to your mail");
          }
        }
      } catch (error) {
        console.log("error is ", error.message);
      }
    } else {
      try {
        const res = await axios.post("https://budgetfoods.onrender.com/signup-otp", {
          email,
          password,
          otp,
        });
         
        console.log("what is the response", res);
        if (res) {
          Alert.alert("Logged in successfully");

          if (remember) {
            const user = { email, password };
            await AsyncStorage.setItem("user", JSON.stringify(user));
          }
          fetchData();
        }
      } catch (error) {
        console.log("error is ", error.message);
      }
    }

    setLoading(false); // Set loading to false when the request completes
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Sign Up</Text>
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
        {otp !== 0 && (
          <TextInput
            style={styles.input}
            placeholder="OTP"
            onChangeText={(text) => setOtp(text)}
          />
        )}
        <View style={styles.checkboxRow}>
          <CheckBox
            onPress={() => setRemember(!remember)}
            title="Remember me"
            isChecked={remember}
          />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#0056b3" : "#007bff" },
          ]}
          onPress={handleLogin}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
          )}
        </Pressable>
        {/* <Text style={styles.forgotPassword}>Forgot Password?</Text> */}
      </View>
      <Pressable onPress={handleSignin}><View style={styles.button}><Text style={{textAlign:'center'}}>sign-in</Text></View></Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxText: {
    fontSize: 16,
    color: '#777',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
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
  },
  
  forgotPassword: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  
});

export default Login;
