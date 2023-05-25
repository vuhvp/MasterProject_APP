import { Camera, CameraType } from 'expo-camera';
import { Image } from 'expo-image';
import { FlipType, SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { useState, useMemo } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

export default function CameraScreen({ route, navigation }) {
    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [camera, setCamera] = useState(null);


    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'Boy',
            value: 'boy',
            color: 'white',
            labelStyle: {
                color: 'white'
            }
        },
        {
            id: '2',
            label: 'Girl',
            value: 'girl',
            color: 'white',
            labelStyle: {
                color: 'white'
            }
        }
    ]), []);

    const [selectedId, setSelectedId] = useState('1');

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
            let photo = await camera.takePictureAsync();
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

            navigation.navigate('ImageScreen', { imageUri: photo.uri, room: route.params.room })
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <Text style={styles.text}>Please adjust your face to fit the image</Text>
                {
                    selectedId === '1' ? <Image
                        style={styles.backgroundFace}
                        source={require('../assets/boy.png')}
                        contentFit='contain'
                    /> : <Image
                        style={styles.backgroundFace}
                        source={require('../assets/girl.png')}
                        contentFit='contain'
                    />
                }

                <View style={styles.radioGroup}>
                    <RadioGroup
                        radioButtons={radioButtons}
                        onPress={setSelectedId}
                        selectedId={selectedId}
                        layout='row'
                    />
                </View>
                <Camera
                    ref={(ref) => setCamera(ref)}
                    style={styles.camera}
                    type={type}
                />
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
        flex: 10,
        position: 'relative'
    },
    text: {
        position: 'absolute',
        top: 100,
        left: 0,
        width: '100%',
        height: 20,
        textAlign: 'center',
        color: 'white',
        zIndex: 2,
        backgroundColor: 'black',
        opacity: 0.5
    },
    backgroundFace: {
        flex: 1,
        zIndex: 2
    },
    radioGroup: {
        zIndex: 2,
        alignItems: 'center',
    },
    cameraBorder: {
        borderColor: 'green',
        borderWidth: 4,
        overflow: 'hidden',
        backgroundColor: 'transparent'
    },
    camera: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0
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