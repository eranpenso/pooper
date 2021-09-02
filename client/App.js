import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { render } from 'react-dom';
import { StyleSheet, Text, View,Pressable,Image, TouchableOpacity,Linking,Alert,Button,Modal } from 'react-native';
import Icon from 'react-native-ico-material-design';
import MapPage from './screens/mapscreen';
import AddPage from './screens/addscreen';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { useState } from 'react';
var iconHeight = 26;
var iconWidth = 26;

export default function App() {

  const [shouldShow,setShouldShow] = useState(true)
  const [showPopUp,setShowPopUp] = useState(false)
  const handleModal = () => setShowPopUp(() => !showPopUp);
  

  _getLocation = async() => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      this.setState({
        errorMessage: 'PERMISSION NOT GRANTED'
      })
    }
    const userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return userLocation;
  }

  _locateClosest = () =>{
      _getLocation().then(userlocation =>{
     let user_latitude = userlocation.coords.latitude;
     let user_longitude = userlocation.coords.longitude;
     let min_res=9999999;
     let min_lan=0;
     let min_lon=0;
     let min_adress = '';

    fetch('https://publicrestroom-app.herokuapp.com/getpins')
    .then(res => res.json())
    .then(data => {
      if(!data){
        Alert.alert("error","there was a problem, try again later",['ok']);
        return;
      }
      else{
        data.map((report) =>{
        console.log('aaaa'+report);
        if(_getDistanceFromLatLonInKm(user_latitude,user_longitude,report.latitude,report.longitude)<min_res){
        min_lan = report.latitude;
        min_lon = report.longitude;
        min_adress = report.adress;
        }
        })
        console.log(min_lan+","+min_lon)

          Alert.alert("hey!",`the closest destination is at ${min_adress}`,[
            {
              text: "take me there",
              onPress: () =>{
                Linking.openURL(`http://www.google.com/maps/dir/?api=1&destination=${min_lan},${min_lon}&travelmode=walking`);
              },
              style: 'default',
            },
            {
              text: "cancel",
              style: "cancel",
            },
           ],{cancelable:false})
      }
      //this.setState({ reports: data }, () => console.log('nice'));
    }).catch(error => console.log("there was an error --> " + error));
   })
 }

_deg2rad = (deg) =>{
   return deg * (Math.PI/180)
 }

 _getDistanceFromLatLonInKm = (lat1,lon1,lat2,lon2) => {
   var R = 6371; // Radius of the earth in km
   var dLat = (lat2-lat1)* (Math.PI/180);  // deg2rad below
   var dLon = (lon2-lon1)* (Math.PI/180); 
   var a = 
     Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.cos((lat1)* (Math.PI/180)) * Math.cos((lat2)* (Math.PI/180)) * 
     Math.sin(dLon/2) * Math.sin(dLon/2)
     ; 
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
   var d = R * c; // Distance in km
   return d;
 }

  return (
    <View style={styles.container}>
      {shouldShow ? <MapPage/>:<AddPage/>}
    <View>
      <StatusBar style="light" />
    </View>      
    <View style={styles.NavContainer}>

      <View style={shouldShow ? styles.urgentButton : styles.urgentButtonDisapeer }>
         <Pressable onPress={_locateClosest} style={shouldShow ? styles.IconBehaviour : styles.disapeerUrgentButton} android_ripple={{borderless:true,radius:50}}>
            <Text style={{color:"#593001"}}>NAVIGATE ME TO THE CLOSETS</Text>
          </Pressable>
      </View>

      <View style={styles.NavBar}>
            <Pressable onPress={() => {setShouldShow(true)}} style={styles.IconBehaviour} android_ripple={{borderless:true,radius:50}}>
                <Icon name="map-placeholder" height={iconHeight} width={iconWidth} color="#593001"/>
            </Pressable>

            <Pressable onPress={() => {setShouldShow(false)}} style={styles.IconBehaviour} android_ripple={{borderless:true,radius:50}}>
                <Icon name="add-button-inside-black-circle" height={iconHeight} width={iconWidth} color="#593001"/>
            </Pressable>
      </View>
      </View>
     
      <TouchableOpacity style={{ position: 'absolute',
         right: 20,
         top: 60}} onPress={handleModal}>
      <Image source={require("./assets/infobutton.png")} style={{
        flex:1,
        height:35,
        width:35
      }}/>
      </TouchableOpacity>

       <Modal visible={showPopUp} transparent={true}>
        <View style={{backgroundColor:'#000000aa',flex:1,}}>
            <View style={{ margin:50,alignItems:'center',padding:40,borderRadius:10,flex:1,backgroundColor:'#fff'}}>
              <Text style={{letterSpacing: 1}}>Hello! So let me explain what this app is all about.. The map that you see when you launch the app is exactly the same among all users.
              The markers on the second tab on the map are added by the users.
              How can you help us while you benefit from it yourself? After you visit a public restroom, just go to the form on the second tab, type in the adress of the restroom and add in some description about the place (for example: cleanliness)
              By adding new markers you expand our map so that you and the other users can also take advantage from it.
              By the way, my name is Eran Penso and I am an 18 year developer. Thank you for being a part of my journey!
              </Text>
              <TouchableOpacity style={styles.loginBtn}  onPress={handleModal}>
              <Text style={{color:'white'}}>Close</Text>
              </TouchableOpacity>
            </View>
            </View>
        </Modal>  
     
      </View>       
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  NavContainer:{
    position:'absolute',
    alignItems:'center',
    bottom:20,
  },
  NavBar:{
    borderWidth:4,
    borderColor:'#593001',
    flexDirection:'row',
    backgroundColor:'#fff',
    width:'90%',
    justifyContent:'space-evenly',
    borderRadius:40,
  },
  IconBehaviour:{
    padding:14,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  urgentButton:{
    borderWidth:4,
    borderColor:"#593001",
    flexDirection:'row',
    backgroundColor:'#fff',
    width:'75%',
    justifyContent:'space-evenly',
    borderRadius:40,
    marginBottom:17
  },
  urgentButtonDisapeer:{
    borderWidth:0,
  },
  disapeerUrgentButton:{
    width:0,
    height:0,
    borderColor:'#fff',
    backgroundColor:'#fff',
    
  },
  modalStyle:{
    borderRadius:40,
    margin:30,
    justifyContent:'center'
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
    }

});
