import { View, Button, Alert, Image, Text, StyleSheet } from "react-native"
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker'
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../ui/OutlinedButton";

function ImagePicker() {

    const [pickedImage, setPickedImage] = useState()
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();

    async function verifyPermissions() {
        if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if(cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert("Insufficient permissions", "You need to grand camera permission to use this app.")
            return false;
        }

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermissions()

        if(!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5
        })

        setPickedImage(image.assets.at(0).uri)
    }


    return (
        <View>
            <View style={styles.imagePreview}>
                {pickedImage && <Image source={{uri: pickedImage}} style={styles.image}/>}
                {!pickedImage && <Text>No image picked yet.</Text>}
            </View>
            <OutlinedButton onPress={takeImageHandler} icon="camera">Take photo</OutlinedButton>
        </View>
  )
}

export default ImagePicker

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },

    image: {
        width: '100%',
        height: '100%'
    }
})