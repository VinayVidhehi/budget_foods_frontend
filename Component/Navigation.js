import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Home from './Home';
import Cart from './Cart';

const Navigation = ({naavigation, route}) => {

    const handleHomeClick = () => {
        console.log("home");
        //
    }

    const handleCartClick = () => {
        console.log("cart")
    }

  return (
   <View style={styles.mainContainer}>
     <TouchableOpacity style={styles.backButton} onPress={()=>handleHomeClick()}><Text style={styles.backButtonText}>Home</Text></TouchableOpacity>
     <TouchableOpacity style={styles.backButton} onPress={()=>handleCartClick()}><Text style={styles.backButtonText}>cart</Text></TouchableOpacity>
   </View>
  )
}

const styles = StyleSheet.create({
    mainContainer: {
        borderColor: "black",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    backButton: {
        margin:10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        width:'20%',
        textAlign: 'center',
        display: 'flex',
        justifyContent : 'center',
        alignItems: 'center',
      },
    backButtonText: {
        color:"#fff",
    }
})

export default Navigation;