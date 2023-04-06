import { Image } from 'expo-image';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';
import { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SocketContext } from '../context/socket';

export default function ImageScreen({ route, navigation }) {
    const socket = useContext(SocketContext);
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        setImageUri(route.params.imageUri)
    }, [])

    async function usePhoto() {
        const photo = await manipulateAsync(
            imageUri,
            [
                { resize: { width: 90, height: 90 } },
            ],
            { compress: 1, format: SaveFormat.PNG, base64: true }
        );
        socket.emit('imageUri', photo.base64)
    }

    function retake() {
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={imageUri}
                    contentFit="contain"
                    transition={1000}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title='Use Photo' onPress={usePhoto} />
                <Button title='Retake' onPress={retake} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        flex: 2,
        // backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    buttonContainer: {
        flex: 1,
    }
});