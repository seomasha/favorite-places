import { View, StyleSheet, Alert, Text, Image } from "react-native"
import OutlinedButton from "../ui/OutlinedButton"
import { Colors } from "../../constants/colors"
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from "expo-location"
import { useEffect, useState } from "react"
import { getMapPreview } from "../../util/location"
import { useNavigation, useRoute, useIsFocused } from "@react-navigation/native"

function LocationPicker() {
    const [pickedLocation, setPickedLocation] = useState();
    const isFocused = useIsFocused();
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        if(isFocused && route.params) {
            const mapPickedLocation = {lat: route.params.pickedLat, lng: route.params.pickedLng};
            setPickedLocation(mapPickedLocation)
        }
    },[route, isFocused])

    async function verifyPermissions() {
        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if(locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert("Insufficient permissions", "You need to grant location permission to use this app.")
            return false;
        }

        return true;

    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();
        const location = await getCurrentPositionAsync();

        if(!hasPermission) {
            return;
        }

        setPickedLocation({lat: location.coords.latitude, lng: location.coords.longitude})
    }

    function pickOnMapHandler() {
        navigation.navigate("Map");
    }

    return (
        <View>
            <View style={styles.mapPreview}>
                {!pickedLocation && <Text>No location picked yet.</Text>}
                {pickedLocation && <Image source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}} style={styles.image}/>}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>Locate user</OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>Pick on map</OutlinedButton>
            </View>
        </View>
    )
}

export default LocationPicker

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },
    actions: {
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    image: {
        width: '100%',
        height: '100%'
    }
})