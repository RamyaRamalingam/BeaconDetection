/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
  Image,
  FlatList,
  Platform
} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { Images } from './assets/images';
import { removeListeners, requestLocationPermission, stopRanging } from './beaconsManagerUtils';
import { deviceHeight, deviceWidth } from './Dimensions';
import { startProximityObserver, stopProximityObserver } from './estimoteUtils';
import { DeviceEventEmitter, PermissionsAndroid } from "react-native";
import Beacons, {BeaconRegion} from 'react-native-beacons-manager';
import {beaconDetails} from './credentials/beaconDetails';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import beacons from 'react-native-beacons-manager';
// import from 'react-native-beacons-manager';
import { NativeEventEmitter, NativeModules } from 'react-native';




class App extends React.Component{
  beaconsDidRangeEvent = null;
  
  constructor(){
    super();
    // var temp = this.checkPermission()
    
    // console.log("temp:",temp)
  //   request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
  //     console.log("request:",result)
  //   Alert.alert("request"+result)
  // });
    
    
    
  
    

    this.state={
      search: false,
      context: null,
      beaconsArray: [],
      bluetoothStatus: '',
      iosLocationPermission:false
    }
  }


  // checkPermission = async() => {
  //   Alert.alert("Entered checkPermission")
  // var permission = false
  // // request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
  // //     console.log("request permission then block:",result)
  // //     Alert("request permission then block"+result)
  // //   })
  // //   .catch((error) => {
  // //     Alert("request permission error"+error)
  // //   })
  //   try {
   
  //     // Alert.alert("iOS permission try block")
  //     // var resp = Beacons.requestAlwaysAuthorization()
  //     // Alert.alert("resp"+resp)
  //     // Beacons.shouldDropEmptyRanges(true)
  //     //      Beacons.shouldDropEmptyRanges(true);
  //     //     this.initiateBeaconRanging();




    

  //     check(PERMISSIONS.IOS.LOCATION_ALWAYS)
  //     .then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           console.log('This feature is not available (on this device / in this context)');
  //           Alert.alert("iOS location permission ",'This feature is not available (on this device / in this context)')
  //           break;
  //         case RESULTS.DENIED:
  //           console.log('The permission has not been requested / is denied but requestable');
  //           Alert.alert("iOS location permission ",'The permission has not been requested / is denied but requestable')
  //           break;
  //         case RESULTS.LIMITED:
  //           console.log('The permission is limited: some actions are possible');
  //           Alert.alert("iOS location permission ",'The permission is limited: some actions are possible')
  //           break;
  //         case RESULTS.GRANTED:
  //           console.log('The permission is granted');
  //           Alert.alert("iOS location permission ",'The permission is granted')
  //           this.state.iosLocationPermission = true
  //           this.setState({iosLocationPermission:this.state.iosLocationPermission})
  //           permission = true
  //           break;
  //         case RESULTS.BLOCKED:
  //           console.log('The permission is denied and not requestable anymore');
  //           Alert.alert("iOS location permission ",'The permission is denied and not requestable anymore')
  //           break;
  //       }
  //     })
  //     .catch((error) => {
  //       Alert.alert("iOS location permission ",error)
  //     });
         
    
  //   }
  //   catch(e){
  //     Alert.alert("iOS permission error"+e)
  //   }
  //   return permission
  // }
  componentDidMount =async()=>{
    // this.checkBluetoothStatus();
    // Alert.alert("Credentials: "+ beaconDetails.identifier, beaconDetails.uuid);
    // Beacons.detectIBeacons();
    // Beacons.startRangingBeaconsInRegion(beaconDetails.identifier, beaconDetails.uuid)
    //       .then(() => {
    //               Alert.alert("started ranging")
    //               beaconsDidRangeEvent = DeviceEventEmitter.addListener(
    //                   'beaconsDidRange',
    //                   async(data) => {
    //                       Alert.alert("Beacons did range", JSON.stringify(data["beacons"]));
    //                       // beaconsArray = data["beacons"];
    //                       //return data["beacons"];
    //                       this.setState({beaconsArray: data["beacons"]});
    //                   }
    //               );
    //               Alert.alert("Beacons Array inside: "+JSON.stringify(this.state.beaconsArray));
    //               console.log('Beacon 1 ranging started succesfully')
    //           }
    //       )
    //       .catch(error => Alert.alert("RANGING ERROR: ", JSON.stringify(error)));

    this.bluetoothStateChangeSubscription = BluetoothStateManager.onStateChange( (bluetoothState)=>
       this.checkBluetoothStatus(bluetoothState),
      true /*=emitCurrentState*/
    );
  }

  checkBluetoothStatus = (bluetoothState)=>{
    // Alert.alert("Checking bluetooth...", bluetoothState);
    BluetoothStateManager.getState().then((bluetoothState) => {
      console.log("bluetooth state: ", bluetoothState);
      this.setState({bluetoothStatus: bluetoothState});
      switch (bluetoothState) {
        case 'Unknown': break;
        case 'Resetting': break;
        case 'Unsupported': break;
        case 'Unauthorized': break;
        case 'PoweredOff':{
          // this.setState({bluetoothStatus: 'Off'});
          Alert.alert("Enable Bluetooth","Please turn on the bluetooth to detect the beacons around you.")
          break;
        }
        case 'PoweredOn':{
          // this.setState({search: true});
          //  this.setState({bluetoothStatus: 'On'});
            this.startDetection();
           break;        
        }
        default:
          break;
      }
    });
  }

// iosBeacon =  () => {
//   console.log("Entered ios beacon ....")
//   Beacons.startRangingBeaconsInRegion(beaconDetails);
//             // .then(() => {
//                 // Alert.alert("started ranging")
//                 console.log("Entered startRanging")
//                 // Beacons.startUpdatingLocation();
//                 // const { RNiBeacon } = NativeModules;

//                 // const beaconManagerEmiiter = new NativeEventEmitter(RNiBeacon);

//                 // const subscription =beaconManagerEmiiter.addListener(
//                 // 'beaconsDidRange',
//                 // (reminder) => {
//                 //   console.log("Entered listener")
//                 //   // console.log(String(reminder))
//                 // }
//                 // );

//                 // const subscription = DeviceEventEmitter.addListener(
//                 //     'beaconsDidRange',
//                 //     (data) => {
//                 //       console.log("Entered listener")
//                 //       console.log("data:",data["beacons"])
//                 //     })
//             //     this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
//             //         'beaconsDidRange',
//             //          (data) => {
//             //            console.log("Entered listener")
//             //           console.log("beacon data:",String(data))
//             //           // this.state.search = false
//             //           // this.setState({search: this.state.search});
//             //           //   // this.setState({search: false});
//             //           //   // beaconsArray = data;
                        
//             //           //   // var beaconsArray = data["beacons"];
//             //           //   // return data["beacons"];
//             //           //   // this.state.beaconsArray = beaconsArray;
//             //           //   if(data["beacons"].length != 0 ){
//             //           //     // if(data["beacons"][0][major] != beaconsArray[0].major)
//             //           //       this.setState({beaconsArray: data["beacons"]});
//             //           //   }
//             //           //   // this.setState({beaconsArray: [...this.state.beaconsArray, ...data["beacons"] ] })

//             //           //   // this.setState({ beaconsArray: data["beacons"]}) 
//             //         }
//             //     )
//             //     // Alert.alert("Beacons Array inside: "+JSON.stringify(beaconsArray));
//             //         // console.log('Beacon 1 ranging started succesfully');
//             //         // Alert.alert('Beacon 1 ranging started succesfully');
//                   // }
            
//             // )
//             // .catch(error => Alert.alert("RANGING ERROR: ", JSON.stringify(error)));

// //   const region = {
// //     identifier: ''
// //     // 'Estimotes'
// //     ,
// //     uuid:'73697475-6D73-6974-756D-736974756D15'
// //     //  'B9407F30-F5F8-466E-AFF9-25556B57FE6D'
// //     //  ,
// //     // major: '1',
// //     // minor:'1'
// // };

// // // Request for authorization while the app is open
// // // Beacons.requestWhenInUseAuthorization();
// // // Beacons.requestAlwaysAuthorization();
// // Beacons.startMonitoringForRegion(region);
// // Beacons.startRangingBeaconsInRegion(region);

// // // Beacons.startUpdatingLocation();

// // // Listen for beacon changes
// const subscription = DeviceEventEmitter.addListener(
//   'beaconsDidRange',
//   (data) => {
    
    
//     console.log("beacon data:",data)
//     // data.region - The current region
//     // data.region.identifier
//     // data.region.uuid

//     // data.beacons - Array of all beacons inside a region
//     //  in the following structure:
//     //    .uuid
//     //    .major - The major version of a beacon
//     //    .minor - The minor version of a beacon
//     //    .rssi - Signal strength: RSSI value (between -100 and 0)
//     //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate"
//     //    .accuracy - The accuracy of a beacon

//     this.state.search = false
//     this.setState({search: this.state.search});
//       // this.setState({search: false});
//       // beaconsArray = data;
      
//       // var beaconsArray = data["beacons"];
//       // return data["beacons"];
//       // this.state.beaconsArray = beaconsArray;
//       if(data["beacons"].length != 0 ){
//         // if(data["beacons"][0][major] != beaconsArray[0].major)
//           this.setState({beaconsArray: data["beacons"]});
//       }
//       // this.setState({beaconsArray: [...this.state.beaconsArray, ...data["beacons"] ] })

//       // this.setState({ beaconsArray: data["beacons"]}) 
//     }
// );
// }
  startDetection = async ()=> {
    // Alert.alert("Bluetooth Powered on..Entered start detection")
    this.state.search = true
    this.setState({search: this.state.search});

   if (Platform.OS === 'android') {
     var permissionStatus =  await requestLocationPermission();
     //  var beaconContext = startProximityObserver();
     if(permissionStatus === PermissionsAndroid.RESULTS.GRANTED){
        this.initiateBeaconRanging();
        }
     else{
         Alert.alert("Enable Location", "Location is needed to find the beacons accurately.")
              console.log("Location permission denied")
          }
    }
    else if(Platform.OS === 'ios') {

  const granted = await request(
    Platform.select({
      // android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
    {
      'title': 'Location Permission',
      'message': 'Virtual Stores needs to access your location.'
  },
  );
console.log('granted:',granted)
        if (granted =='granted') {
          this.initiateBeaconRanging();
        }
     else{
         Alert.alert("Enable Location", "Location is needed to find the beacons accurately.")
              console.log("Location permission denied")
          }
// Alert.alert('granted:'+granted)
  // return granted === RESULTS.GRANTED;
  // Alert.alert("Entered iOS block ")
  // Alert.alert("this.state.iosLocationPermission1"+ this.state.iosLocationPermission)
  // this.state.iosLocationPermission == true?
  // this.initiateBeaconRanging()
  // :null
  // try {
  
    // Alert.alert("iOS permission try block")
    // request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
    //       console.log("request permission then block:",result)
    //       Alert("request permission then block"+result)
    //     })
    // beacons.requestAlwaysAuthorization()
    //  Beacons.requestAlwaysAuthorization()
    //      Beacons.shouldDropEmptyRanges(true);
        // this.initiateBeaconRanging();

// this.iosBeacon()
      //   check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      // .then((result) => {
      //   switch (result) {
      //     case RESULTS.UNAVAILABLE:
      //       console.log('This feature is not available (on this device / in this context)');
      //       Alert.alert("iOS location permission ",'This feature is not available (on this device / in this context)')
      //       break;
      //     case RESULTS.DENIED:
      //       console.log('The permission has not been requested / is denied but requestable');
      //       Alert.alert("iOS location permission ",'The permission has not been requested / is denied but requestable')
      //       break;
      //     case RESULTS.LIMITED:
      //       console.log('The permission is limited: some actions are possible');
      //       Alert.alert("iOS location permission ",'The permission is limited: some actions are possible')
      //       break;
      //     case RESULTS.GRANTED:
      //       console.log('The permission is granted');
      //       Alert.alert("iOS location permission ",'The permission is granted')
      //       this.state.iosLocationPermission = true
      //       this.setState({iosLocationPermission:this.state.iosLocationPermission})
      //       permission = true
      //       break;
      //     case RESULTS.BLOCKED:
      //       console.log('The permission is denied and not requestable anymore');
      //       Alert.alert("iOS location permission ",'The permission is denied and not requestable anymore')
      //       break;
      //   }
      // })
      // .catch((error) => {
      //   Alert.alert("iOS location permission ",error)
      // });
         
  // }
  // catch(e){
  //   Alert.alert("iOS permission error"+e)
  // }
       
       }



          //  var permissionStatus =  await requestLocationPermission();
          // //  var beaconContext = startProximityObserver();

          // if(permissionStatus === PermissionsAndroid.RESULTS.GRANTED){
          //   this.initiateBeaconRanging();
          // }
          // else{
          //   Alert.alert("Enable Location", "Location is needed to find the beacons accurately.")
          //   console.log("Location permission denied")
          // }

          //  console.log("BeaconContext: ", JSON.stringify(beaconContext));
          //  Alert.alert("Beacon Context: ", beaconContext);

          //  if(beaconContext.length != 0)
          //  {
          //    this.setState({search: false});
          //    Alert.alert("Beacon Context not null: ", JSON.stringify(beaconContext));
          //    this.setState({context: beaconContext});
          //    this.setState({beaconsArray: beaconContext});
          //   //  if(Array.isArray(beaconContext)){
          //   //     Alert.alert("Beacon context is an array");
          //   //     this.setState({context: beaconContext});
          //   //     this.setState({beaconsArray: beaconContext});
          //   //  }
          //   //  else{
          //   //   Alert.alert("Beacon Context is not an array", JSON.stringify(beaconContext));
          //   //   this.setState({context: beaconContext});
          //   //   this.setState({beaconsArray: [beaconContext]});
          //   //  }
          //  }
          //  else{
          //   Alert.alert("Beacon Context is null'", JSON.stringify([]));
          //   this.setState({context: null});
          //   this.setState({beaconsArray: []});
          //  } 
  }
  

  initiateBeaconRanging = () =>{
    // Alert.alert("Entered initiateBeaconRanging ")
    // if (Platform.OS === 'ios') {
    //   Beacons.requestWhenInUseAuthorization();
    // }
    if (Platform.OS === 'android') {
    Beacons.detectIBeacons();
    }
    Beacons.startRangingBeaconsInRegion(beaconDetails)
            .then(() => {
                // Alert.alert("started ranging")
                // Beacons.startUpdatingLocation();
                this.beaconsDidRangeEvent = DeviceEventEmitter.addListener(
                    'beaconsDidRange',
                     (data) => {
                      this.state.search = false
                      this.setState({search: this.state.search});
                        // this.setState({search: false});
                        // beaconsArray = data;
                        
                        // var beaconsArray = data["beacons"];
                        // return data["beacons"];
                        // this.state.beaconsArray = beaconsArray;
                        if(data["beacons"].length != 0 ){
                          // if(data["beacons"][0][major] != beaconsArray[0].major)
                            this.setState({beaconsArray: data["beacons"]});
                        }
                        // this.setState({beaconsArray: [...this.state.beaconsArray, ...data["beacons"] ] })

                        // this.setState({ beaconsArray: data["beacons"]}) 
                    }
                )
                // Alert.alert("Beacons Array inside: "+JSON.stringify(beaconsArray));
                    console.log('Beacon 1 ranging started succesfully');
                    // Alert.alert('Beacon 1 ranging started succesfully');
                  }
            
            )
            .catch(error => Alert.alert("RANGING ERROR: ", JSON.stringify(error)));
    // }
    
    
    
  }

  componentWillUnmount(){
    // stopProximityObserver();
    stopRanging();
    this.beaconsDidRangeEvent.remove();
    // removeListeners();
  }

  render(){
   

// Define a region which can be identifier + uuid,
// identifier + uuid + major or identifier + uuid + major + minor
// (minor and major properties are numbers)

    return(
    <SafeAreaView style={{height: deviceHeight, backgroundColor:'white'}}>
      {this.state.bluetoothStatus == "PoweredOn"?
        this.state.search == true || this.state.beaconsArray.length == 0 ?
                <View style={{flexDirection: 'column',height: deviceHeight, alignItems:'center', justifyContent:'center'}}>
                    <Image source={Images.beaconIcon}
                      style={{width: deviceWidth, height: deviceHeight/2}}/>
                    <View style={styles.scanningContainer}>   
                         <Image source = {Images.loaderGif}/>
                         <Text style={styles.scanningText}>
                             Searching for beacons around you...
                         </Text>
                     </View>
                </View>
                 : 
                // this.state.beaconsArray.length != 0 ?
                // <View style={{flexDirection:'column',height: deviceHeight, alignItems: 'center', justifyContent:'center'}}>
                //   <Text style={{color:'black', }}>Beacons {JSON.stringify(this.state.beaconsArray)}</Text>
                // </View>
                // <View style = {{height:'95%', width:'100%', backgroundColor: 'white', marginTop: 30}}>
                  // {/* <Text style={{color:'black', alignSelf:'center'}}>{JSON.stringify(this.state.beaconsArray)}</Text> */}
                //  <FlatList
                //   data={this.state.beaconsArray}
                //   renderItem ={({item, index})=>
                //     {
                //       return (
                //         <View  style={{ width: '100%', backgroundColor:'white', alignSelf:'center', justifyContent:"center"}}>
                //            <Text style={{color:'black', alignSelf:'center'}}>{JSON.stringify(item)}</Text>
                //            <View style={{height:1, width: '100%', backgroundColor:'black', marginVertical:10}}/>
                //         </View>
                //       );
                //     }
                //   }
                  //  /> 
              //  </View> 
                <FlatList scrollEnabled={true}
                style={{paddingTop: 10, flex:1}}
                  data={this.state.beaconsArray}
                  ListHeaderComponent={()=><Text style={{color:'black', fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Beacons</Text>}
                  ListFooterComponent = {()=><View style={{height: 20}}/>}
                  // ItemSeparatorComponent={()=><View style={{height:1, width: '100%', backgroundColor:'black'}}/>}
                  renderItem={({item, index})=>
                  {
                    // var beaconArray = JSON.stringify(item);
                    return(
                      item.proximity == 'unknown'?null:
                      <View style={{width: '95%',flexDirection:'column', justifyContent:"center", margin:10, paddingHorizontal:10, paddingTop:10, borderRadius:5, backgroundColor:'#F5F5F5', elevation:5}}>
                        <View style={{flexDirection:'row', marginBottom:10, flex:1, justifyContent:'space-between'}}>
                          <View style={{flexDirection: 'column', flex: 0.6}}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>UUID: </Text>
                            <Text style={{color: 'black', marginBottom:10}}>{item.uuid}</Text>
                          </View>
                          <View style={{flexDirection: 'column', flex: 0.3}}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Minor: </Text>
                            <Text style={{color: 'black', marginBottom:10}}>{item.minor.toString(16)}</Text>
                          </View>
                        </View>
                        <View style={{flexDirection:'row', marginBottom:5, flex:1, justifyContent:'space-between'}}>
                          <View style={{flexDirection: 'column', flex: 0.6}}>
                          <Text style={{fontWeight: 'bold', color:'black'}}>Proximity: </Text>
                          <Text style={{color:'black', marginBottom:10}}>{item.proximity}</Text>
                          </View>
                          <View style={{flexDirection: 'column', flex: 0.3, alignSelf:'flex-end'}}>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Major: </Text>
                            <Text style={{color: 'black', marginBottom:10}}>{item.major.toString(16)}</Text>
                          </View>
                        </View>
                        <View style={{flexDirection:'row', marginBottom:5, flex:1, justifyContent:'space-between'}}>
                            <View style={{flexDirection: 'column', flex: 0.6}}>
                              <Text style={{fontWeight: 'bold', color: 'black'}}>Distance: </Text>
                              <Text style={{color: 'black', marginBottom:10}}>{Platform.OS =='android'?item.distance:Platform.OS=='ios'?item.accuracy:'--'}</Text>
                            </View>
                            <View style={{flexDirection: 'column', flex: 0.3, alignSelf:'flex-end'}}>
                              <Text style={{fontWeight: 'bold', color: 'black'}}>RSSI: </Text>
                              <Text style={{color: 'black', marginBottom:10}}>{item.rssi}</Text>
                            </View>
                        </View>
                          {/* <View>
                            <Text style={{fontWeight: 'bold', color: 'black'}}>Minor: </Text>
                            <Text style={{color: 'black', marginBottom:10}}>{item.minor}</Text>
                        </View> */}
                        {/* <View style={{height: 10}}/> */}
                      </View>
                      
                    );
                  }
                  }
                />
                :
                <View style={{flexDirection: 'column',height: deviceHeight, alignItems:'center', justifyContent:'center'}}>
                    <Image source={Images.beaconIcon}
                      style={{width: deviceWidth, height: deviceHeight/2}}/>
                    <View style={styles.scanningContainer}>   
                         <Image source = {Images.loaderGif}/>
                         <Text style={styles.scanningText}>
                             Searching for products around you...
                         </Text>
                     </View>
                </View>}
               
    </SafeAreaView>);
  }
}

export default App;

const styles = StyleSheet.create({
  scanningContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent:"flex-start", 
    marginTop: 20
},
scanningText: {
    color:"#000", 
    fontSize: 18, 
 //    fontWeight: 'bold'
 ...Platform.select({
     android: {
         fontFamily: "sans-serif-medium"
     },
 }),
 },
})


