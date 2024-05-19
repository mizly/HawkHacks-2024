import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Svg, {Path} from "react-native-svg";
import { BASE_URL } from './config';
const API_URL = `${BASE_URL}/upload`;

export default function Camera(route) {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null); // Reference to the camera component
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [message, setMessage] = useState('');
  const navigation = useNavigation(); // Get navigation object

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePictureAndUpload() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true }); // Capture the picture as base64
        console.log('Photo captured.');
  
        // Make HTTP POST request to upload the image to the Flask API endpoint
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: photo.base64 }), // Send the base64 encoded image data in the request body
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.log('Image uploaded successfully:', responseData);
          // Display an alert with the response data
          setIsSuccess(true);
          setMessage(responseData.message);
          setIsInfoVisible(true);
          // Alert.alert('Upload Successful', responseData.message);

        } else {
          console.error('Failed to upload image:', response.statusText);
          // Handle error response here if needed
          setIsSuccess(false);
          setMessage('Failed to upload image. Please try again.');
          setIsInfoVisible(true);
          // Alert.alert('Upload Failed', 'Failed to upload image. Please try again.');
        }
      } catch (error) {
        console.error('Failed to take picture or upload image:', error);
        Alert.alert('Error', 'Failed to take picture or upload image. Please try again.');
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <MaterialIcons name="flip-camera-ios" size={48} color="#A2B29F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePictureAndUpload}>
            <MaterialIcons name="camera-alt" size={48} color="#A2B29F" />
          </TouchableOpacity>
        </View>
      </CameraView>

      <Modal
      visible={isInfoVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={toggleInfo}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '50%' }}>
          <TouchableOpacity onPress={toggleInfo} style={{alignSelf:'flex-end'}}>
            <Svg onPress={toggleInfo} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 3L21 12L12 21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
          <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 2, fontWeight: 'bold', color: 'green' }}>
            {isSuccess ? 'Upload Successful' : 'Upload Failed'}
          </Text>
          <Text style={{ fontSize: 16, textAlign: 'center', padding: 10 }}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 60,
    backgroundColor: 'transparent',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 10, // Increased padding for larger touch area
    width: '25%', // Adjust as needed
    aspectRatio: 1, // Maintain square shape
    elevation: 3, // Add elevation for shadow effect (Android only)
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
