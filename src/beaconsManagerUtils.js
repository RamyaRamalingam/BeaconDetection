import { Alert, DeviceEventEmitter, PermissionsAndroid } from "react-native";
import Beacons from 'react-native-beacons-manager';
import {beaconDetails} from './credentials/beaconDetails';

var beaconsDidRangeEvent = null;

export const requestLocationPermission = async ()=>{
    
    try {
        const permissionStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                'title': 'Location Permission',
                'message': 'Virtual Stores needs to access your location.'
            },
        )
        console.log('location', permissionStatus);
        return permissionStatus;
        // Alert.alert("LOCATION PERMISSION STATUS: ", JSON.stringify(permissionStatus));
        // if (permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
        //     console.log("Location Permitted")
        //     // Alert.alert("LOCATION PERMISSION GRANTED")
        //     Beacons.detectIBeacons();
            
        //     // Alert.alert("startranging "+ beaconDetails.identifier, beaconDetails.uuid);
        //     var beaconsArray=[];
        //     // Beacons.startRangingBeaconsInRegion(beaconDetails.identifier, beaconDetails.uuid)
        //     // .then(() => {
        //     //     // Alert.alert("started ranging")
        //     //     beaconsDidRangeEvent = DeviceEventEmitter.addListener(
        //     //         'beaconsDidRange',
        //     //          (data) => {
        //     //             // Alert.alert("Beacons did range", JSON.stringify(data["beacons"]));
        //     //             beaconsArray = data["beacons"];
        //     //             // return data["beacons"];
        //     //         }
        //     //     )
        //     //     // Alert.alert("Beacons Array inside: "+JSON.stringify(beaconsArray));
        //     //         console.log('Beacon 1 ranging started succesfully')
        //     //     }
            
        //     // )
        //     // .catch(error => Alert.alert("RANGING ERROR: ", JSON.stringify(error)));
        //     Alert.alert("Beacons Array: "+JSON.stringify(beaconsArray));
        //     // return beaconsArray;
        //     // return "Test";
        // }
        // else {
        //    Alert.alert("Enable Location", "Location is needed to find the beacons accurately.")
        //     console.log("Location permission denied")
        // }
    }
     catch (err) {
        console.warn(err)
    }
}

export const stopRanging = ()=>{
    // Alert.alert("stop ranging")
    Beacons
        .stopRangingBeaconsInRegion(beaconDetails.identifier, beaconDetails.uuid)
        .then(() => {
            console.log('Beacons ranging stopped succesfully');
        })
        .catch(error => console.log(`Beacons ranging not stopped, error: ${error}`));
}

// export const removeListeners = () =>{
//     beaconsDidRangeEvent.remove();
// }