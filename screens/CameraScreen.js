import { Camera, CameraType } from 'expo-camera';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

export default function CameraScreen({ navigation }) {
    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);
    const [screen, setScreen] = useState(Dimensions.get('window'))

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet

        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    async function takePicture() {
        if (camera) {
            let photo = await camera.takePictureAsync(null);
            if (type === CameraType.front) {
                photo = await manipulateAsync(
                    photo.localUri || photo.uri,
                    [
                        { rotate: 180 },
                        { flip: FlipType.Vertical },
                    ],
                    { compress: 1, format: SaveFormat.PNG }
                );
            }
            // setImageUri(photo.uri);
            navigation.navigate('ImageScreen', { imageUri: photo.uri })
        }
    };

    const cameraSize = Math.round((screen.width * 70) / 100)

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <View style={[styles.cameraBorder, { width: cameraSize, height: cameraSize, borderRadius: cameraSize / 2 }]}>
                    <Camera
                        ref={(ref) => setCamera(ref)}
                        style={styles.camera}
                        type={type}
                    />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.captureBtn} onPress={takePicture} />
                    <TouchableOpacity style={styles.flipBtn} onPress={toggleCameraType}>
                        <Image

                            style={styles.flipIcon}
                            source={require('../assets/flip.png')}
                            transition={1000}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraContainer: {
        flex: 3,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    cameraBorder: {
        borderColor: 'green',
        borderWidth: 4,
        overflow: 'hidden',
        backgroundColor: 'transparent'
    },
    camera: {
        width: '100%',
        height: '100%'
    },
    buttonContainer: {
        flex: 2,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    captureBtn: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'white',
    },
    flipBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        right: 60,
        top: 15,
    },
    flipIcon: {
        width: '100%',
        height: '100%',
        tintColor: 'white'
    },
});