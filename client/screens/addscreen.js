import React, {useState} from 'react';
import { StatusBar } from "expo-status-bar";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Icon from 'react-native-ico-material-design';
import * as Sharing from 'expo-sharing';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
    Alert,
  } from "react-native";


class AddPage extends React.Component{
  constructor(){
    super();   
    state={
      adressText:"",
      descriptionText:"",
    } 
  }  
  _getLocation = async() => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      return null;
    }
    const userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    console.log(userLocation)
    return userLocation;
  }

  _submitPressed = async() =>{
    
    if(!this.state){
      console.log('returing false');
      Alert.alert("stop!","fill in adress and description (both)",['ok']);
      return;}

    this._getLocation().then(user_location => { 
      if(user_location==null){
        Alert.alert("error","unable to get your current location",['ok']);
        return; }

      let latitude =  parseFloat(user_location.coords.latitude);
      let longitude =  parseFloat(user_location.coords.longitude);
      
      let fetchData = {
     method: "post",
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
    
     body: JSON.stringify({
       latitude: latitude,
       longitude: longitude,
       adress: this.state.adressText,
       description: this.state.descriptionText
     })
  }
  console.log("fetching")
   fetch('https://publicrestroom-app.herokuapp.com/addpin', fetchData)
   .then(function(response){
     if(response!=null)
        Alert.alert("success!","thanks for improving our map <3",["ok"])
      else
        Alert.alert("error!","try again later",["ok"])
   })
   .catch(error => console.log("there was an error --> " + error));
 });}
 
render(){
    return(
<View style={styles.container}>
<Text style={{marginBottom:40,color:'#593001',fontSize:30,fontWeight:'bold'}}>adding a new restroom</Text>

<StatusBar style="auto" />
<TextInput
  style={styles.TextInput}
  placeholder="adress"
  placeholderTextColor="#593001"
  onChangeText={(val) =>  this.setState({ adressText: val})}
/>

<TextInput
style={styles.TextInput}
placeholder="description"
placeholderTextColor="#593001"
onChangeText={(val) => this.setState({ descriptionText: val })}
/>


<Text style={styles.forgot_button}> your current location will be the location of the pin! 	</Text>

<TouchableOpacity style={styles.loginBtn}  onPress={this._submitPressed}>
    <Text style={{color:'white'}}>add</Text>
</TouchableOpacity>
</View>
    )
}
}
const styles = StyleSheet.create({
container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    width:'100%',
    height:'100%',

  },
  image: {
    marginBottom: 70,
    height:150,
    width:150
  },
  TextInput: {
    borderRadius: 30,
    marginBottom: 20,
    width: "75%",
    textAlign:'center',
    alignItems: "center",
    height: 60,
    borderColor:'#593001',
    borderWidth:5,
    backgroundColor: '#fff',
    color:'#593001',
    textAlign:'center',
    alignItems: "center",
  },
  
  forgot_button: {
    height: 30,
    marginBottom: 30,
    color:'#593001'
  },
  
  loginBtn: {
    width: "75%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    color:"#593001",
    backgroundColor: "#593001",
    borderRadius:30
  },
});
export default AddPage;