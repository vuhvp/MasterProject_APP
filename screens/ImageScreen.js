import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function ImageScreen({ route, navigation }) {
    const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
        setImageUri(route.params.imageUri)
    }, [])

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={imageUri}
                contentFit="contain"
                transition={1000}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        backgroundColor: '#0553',
    },
});