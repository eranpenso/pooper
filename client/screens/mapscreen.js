import React, { useState, useEffect, useLayoutEffect} from 'react';
import { View,StyleSheet,Text,Linking, Alert, Button,Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE ,Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import data from 'react-native-ico-material-design/src/data';

export class MapPage extends React.Component{

  state={
    errorMessage:'',
    location:{},
    reports:[]
  }
  updateReports = reports => {  
    const newReport = reports;    
    this.setState(state => {
      if (state.reports === reports) {
        return null;
      } else {
        return { reports };
      }  
    })  
  }
 
  
  componentDidMount(){
    fetch('https://publicrestroom-app.herokuapp.com/getpins')
    .then(res => res.json())
    .then(data => {
      if(!data){
        Alert.alert("error","there was a problem, try again later",['ok']);
        return;
      }
      //this.setState({ reports: data }, () => console.log('nice'));
      this.updateReports(data);
    }).catch(error => console.log("there was an error --> " + error));
    this._setLocationONMap();
  }




  mapMarkers = () => {
    return this.state.reports.map((report) => <Marker
      key={Math.random() * (100-1) + 1}
      coordinate={{ latitude: (report.latitude), longitude: (report.longitude)}}
      title={report.adress}
      description={report.description}
      onPress={ (event) => this._navigateThere(event.nativeEvent.coordinate)}
      pinColor="#593001"
      >
      <Image
        source={require('../screens/mapmarkertoilet.png')}
        style={{height:50,width:50}}
      />
    </Marker >)
  }
 _navigateThere = async (coordinates) =>{
   await setTimeout(() =>{
    Alert.alert("hey!","should i take you there?",[
      {
        text: "yes",
        onPress: () =>{
          const url=`http://www.google.com/maps/dir/?api=1&destination=${coordinates.latitude},${coordinates.longitude}&travelmode=walking`;
          Linking.openURL(url);
        },
        style: 'default',
      },
      {
        text: "no",
        style: "cancel",
      },
     ],{cancelable:false})   
   },3000);
  
 }
_setLocationONMap = async() =>{
    await this._getLocation();
   this.mapRef.animateToRegion({
      latitude:Number(this.state.location.coords.latitude),
      longitude:Number(this.state.location.coords.longitude),
      latitudeDelta:0.015,
      longitudeDelta:0.0121
    });
  }
  
  _getLocation = async() => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status !== 'granted'){
      this.setState({
        errorMessage: 'PERMISSION NOT GRANTED'
      })
    }
    const userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    this.setState({
      location: userLocation
    })   
    return userLocation;
  }
    render(){
        return(
          <View style={styles.map}>
            <MapView 
            ref={r => this.mapRef = r}
            showsUserLocation={true}
            initialRegion={{
              latitude:parseFloat(0),
              longitude:parseFloat(0),
              latitudeDelta:0.015,
              longitudeDelta:0.0121
            }
            }
            provider={PROVIDER_GOOGLE} 
            style={styles.map}>   
              {this.mapMarkers()}
              
            
     </MapView>
    </View>

        )
    }
}
const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapPage;
