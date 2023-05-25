import { Image } from 'expo-image';
import { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { SocketContext } from '../context/socket';
import { SaveFormat, manipulateAsync } from 'expo-image-manipulator';

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
                { resize: { width: 300 } },
            ],
            { compress: 1, format: SaveFormat.PNG, base64: true }
        );
        socket.emit('imageUriFromApp', { uri: photo.base64, room: route.params.room })
    }

    function retake() {
        navigation.goBack()
    }

    function createFormData(uri) {
        const fileName = uri.split('/').pop();
        const fileType = fileName.split('.').pop();
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: fileName,
            type: `image/${fileType}`
        });
        return formData;
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