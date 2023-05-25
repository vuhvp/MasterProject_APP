import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View, Text } from 'react-native';
import { SocketContext, socket } from './context/socket';
import CameraScreen from './screens/CameraScreen';
import ImageScreen from './screens/ImageScreen';

function HomeScreen({ navigation }) {
  const [text, onChangeText] = useState('');

  function onConnect() {
    socket.emit('join', text)
    navigation.navigate('CameraScreen', { room: text })
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ textAlign: 'center' }}>ID</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
      <Button title='Connect' onPress={onConnect} />
    </View>
  );
}
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SocketContext.Provider value={socket}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Home' }}
          />
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="ImageScreen" component={ImageScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '50%',
    height: 40,
    borderWidth: 1,
  }
});
