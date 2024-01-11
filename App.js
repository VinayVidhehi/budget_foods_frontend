import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./Component/Home";
import Login from "./Component/Login";
import Details from "./Component/Details";
import Cart from "./Component/Cart";
import Restaurant from "./Component/Restaurant";
import RestaurantCred from "./Component/RestaurantCreds";
import Orders from "./Component/Orders";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <View style={styles.appMainContainer}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen
            component={Home}
            name="home"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={Restaurant}
            name="restaurant"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={RestaurantCred}
            name="restaurant-creds"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={Login}
            name="login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={Orders}
            name="orders"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={Details}
            name="details"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            component={Cart}
            name="cart"
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  appMainContainer: {
    marginTop:25,
    padding:2,
    width: "100vw",
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
  },
});

export default App;
