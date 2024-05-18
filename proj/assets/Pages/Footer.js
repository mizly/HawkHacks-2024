import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Svg, {Path} from "react-native-svg";

export default function Footer({ onButtonPress }) {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonPress = (buttonName) => {
    setSelectedButton(buttonName);
    onButtonPress(buttonName);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Quest' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Quest')}>
        <Svg width="40" height="40" strokeWidth="4" viewBox="61.16 61.88 389.6824 388.18" fill="black" xmlns="http://www.w3.org/2000/svg">
          <Path d="M436.38,138c-21.53-46-67.93-74.16-118-76a21.68,21.68,0,0,0-2.17-.12H213.29c-46.31,0-89.6,10-120.79,47.4-26.42,31.71-31.34,68.29-31.34,107.72V432.42A17.9,17.9,0,0,0,78.8,450.06H431.63a17.9,17.9,0,0,0,17.64-17.64V290.93C449.27,242.52,457.48,183.15,436.38,138Zm-332.8,20c18.17-44.52,60-60.76,104.72-60.76H316.2c41,.85,78.47,25.82,92.24,65.11,6.28,17.94,5.55,36.12,5.55,54.72v21.3H96.42C96.23,212,93.49,182.71,103.58,158ZM218.39,273.65H292v33H218.39ZM123.2,414.77H96.44V273.64h86.67v50.67A17.9,17.9,0,0,0,200.75,342H309.68a17.67,17.67,0,0,0,17.64-17.64V273.64H414V414.77Z" stroke="black" stroke-width="4" stroke-linejoin="round"/>
        </Svg>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Achievement' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Achievement')}>
        <Svg width="40" height="40" strokeWidth="1.2" viewBox="1.317 0.349 32 32" fill="black" xmlns="http://www.w3.org/2000/svg">
          <Path d="M 23.823 29.098 L 10.481 29.098 C 9.957 29.098 9.532 29.523 9.532 30.047 C 9.532 30.571 9.957 30.996 10.481 30.996 L 23.823 30.996 C 24.347 30.996 24.772 30.571 24.772 30.047 C 24.772 29.523 24.348 29.098 23.823 29.098 Z M 32.171 5.19 C 32.081 4.749 31.692 4.432 31.242 4.432 L 26.597 4.432 L 26.597 3.485 C 26.597 2.961 26.172 2.536 25.648 2.536 L 8.582 2.536 C 8.057 2.536 7.633 2.961 7.633 3.485 L 7.633 4.432 L 3.132 4.432 C 2.682 4.432 2.292 4.749 2.202 5.19 C 2.175 5.327 1.538 8.652 3.385 10.918 C 4.448 12.221 6.072 12.902 8.204 12.963 C 9.42 16.555 12.476 19.216 16.157 19.613 L 16.157 26.223 L 13.317 26.223 C 12.792 26.223 12.368 26.648 12.368 27.172 C 12.368 27.696 12.792 28.121 13.317 28.121 L 20.988 28.121 C 21.512 28.121 21.937 27.696 21.937 27.172 C 21.937 26.648 21.512 26.223 20.988 26.223 L 18.055 26.223 L 18.055 19.614 C 21.742 19.225 24.805 16.565 26.024 12.969 C 28.228 12.936 29.9 12.249 30.987 10.917 C 32.835 8.651 32.198 5.327 32.171 5.189 L 32.171 5.19 Z M 4.863 9.725 C 4.023 8.702 3.938 7.192 3.981 6.33 L 7.634 6.33 L 7.634 9.533 C 7.634 10.046 7.681 10.547 7.75 11.039 C 6.455 10.919 5.483 10.481 4.864 9.725 L 4.863 9.725 Z M 24.699 9.533 C 24.699 14.073 21.297 17.767 17.116 17.767 C 12.933 17.767 9.531 14.073 9.531 9.533 L 9.531 4.434 L 24.7 4.434 L 24.7 9.533 L 24.699 9.533 Z M 29.511 9.725 C 28.869 10.509 27.849 10.955 26.478 11.055 C 26.549 10.558 26.597 10.052 26.597 9.533 L 26.597 6.33 L 30.392 6.33 C 30.435 7.193 30.351 8.702 29.51 9.725 L 29.511 9.725 Z" stroke="black" stroke-linejoin="round"/>
        </Svg>

        {/* <Text style={[styles.text, selectedButton === 'Profile' && styles.selectedText]}>Profile</Text> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Map' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Map')}>
        <Svg width="40" height="40" strokeWidth="4" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M29.3333 44L14.6667 38.8667L3.3 43.2667C2.48518 43.5926 1.73148 43.5013 1.03889 42.9929C0.346296 42.4844 0 41.8016 0 40.9444V6.72222C0 6.19259 0.153185 5.72407 0.459555 5.31667C0.765926 4.90926 1.18311 4.6037 1.71111 4.4L14.6667 0L29.3333 5.13333L40.7 0.733333C41.5148 0.407407 42.2685 0.499482 42.9611 1.00956C43.6537 1.51963 44 2.20163 44 3.05556V37.2778C44 37.8074 43.8476 38.2759 43.5429 38.6833C43.2381 39.0907 42.8201 39.3963 42.2889 39.6L29.3333 44ZM26.8889 38.0111V9.41111L17.1111 5.98889V34.5889L26.8889 38.0111Z" fill="black"/>
        </Svg>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'Profile' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('Profile')}>
        <Svg width="40" height="40" strokeWidth="4" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M2 30.875C2 28.687 2.86919 26.5885 4.41637 25.0414C5.96354 23.4942 8.06196 22.625 10.25 22.625H26.75C28.938 22.625 31.0365 23.4942 32.5836 25.0414C34.1308 26.5885 35 28.687 35 30.875C35 31.969 34.5654 33.0182 33.7918 33.7918C33.0182 34.5654 31.969 35 30.875 35H6.125C5.03098 35 3.98177 34.5654 3.20818 33.7918C2.4346 33.0182 2 31.969 2 30.875Z" stroke="black" stroke-width="4" stroke-linejoin="round"/>
          <Path d="M18.5 14.375C21.9173 14.375 24.6875 11.6048 24.6875 8.1875C24.6875 4.77024 21.9173 2 18.5 2C15.0827 2 12.3125 4.77024 12.3125 8.1875C12.3125 11.6048 15.0827 14.375 18.5 14.375Z" stroke="black" stroke-width="4"/>
        </Svg>

        {/* <Text style={[styles.text, selectedButton === 'Profile' && styles.selectedText]}>Profile</Text> */}
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selectedButton === 'History' && styles.selectedButton,
        ]}
        onPress={() => handleButtonPress('History')}>
        <Svg width="40" height="40" strokeWidth="4" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M21 42C15.6333 42 10.9573 40.2212 6.972 36.6637C2.98667 33.1061 0.701555 28.6627 0.116667 23.3333H4.9C5.44444 27.3778 7.24344 30.7222 10.297 33.3667C13.3506 36.0111 16.9182 37.3333 21 37.3333C25.55 37.3333 29.4101 35.749 32.5803 32.5803C35.7506 29.4117 37.3349 25.5516 37.3333 21C37.3333 16.45 35.749 12.5907 32.5803 9.422C29.4117 6.25333 25.5516 4.66822 21 4.66667C18.3167 4.66667 15.8083 5.28889 13.475 6.53333C11.1417 7.77778 9.17778 9.48889 7.58333 11.6667H14V16.3333H0V2.33333H4.66667V7.81667C6.65 5.32778 9.07122 3.40278 11.9303 2.04167C14.7894 0.680556 17.8127 0 21 0C23.9167 0 26.649 0.554556 29.197 1.66367C31.745 2.77278 33.9617 4.26922 35.847 6.153C37.7323 8.03989 39.2296 10.2566 40.3387 12.803C41.4478 15.3494 42.0016 18.0818 42 21C42 23.9167 41.4462 26.649 40.3387 29.197C39.2311 31.745 37.7339 33.9617 35.847 35.847C33.9601 37.7323 31.7434 39.2296 29.197 40.3387C26.6506 41.4478 23.9182 42.0016 21 42ZM27.5333 30.8L18.6667 21.9333V9.33333H23.3333V20.0667L30.8 27.5333L27.5333 30.8Z" fill="black"/>
        </Svg>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f7f5f5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    zIndex:10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f5f5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000', // Default text color
  },
  selectedButton: {
    backgroundColor: '#234beb',
  },
  selectedText: {
    color: '#fff', // Text color when button is selected
  },
});
