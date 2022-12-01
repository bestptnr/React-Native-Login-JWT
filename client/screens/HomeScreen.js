import { StyleSheet, Text, View,Button,ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';


const jwtDecode = require('jwt-decode')

const HomeScreen = props => {
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [isLoading,setLoading]= useState(false)



  const loadProfile = async () =>{

    const token = await AsyncStorage.getItem('token')
    setLoading(false)
    if(!token){
      props.navigation.navigate('Login')
    }else{
      props.navigation.navigate('Home')
    }
    console.log(token)
    const decoded = jwtDecode(token)
    setEmail(decoded.email)
    setFullName(decoded.fullName)
    setLoading(true)
  }

  const logout = () =>{
    AsyncStorage.removeItem("token")
    .then(()=>{
      props.navigation.replace('Login')
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    async function perpare(){
      await SplashScreen.preventAutoHideAsync()
    }
    perpare()

    loadProfile()
    

    
    
  },[])

  if(isLoading){
    SplashScreen.hideAsync()
  }


  return (
    <View>
      <Text>{email}</Text>
      <Text>{fullName}</Text>
      <Button 
        title='Logout'
        onPress= { () =>{
          logout();
        }}
      />
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})