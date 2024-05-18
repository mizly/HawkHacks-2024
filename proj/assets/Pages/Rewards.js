import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const HomePage = ({ navigation }) => {
  const handlePress = () => {
    Alert.alert('Button Pressed!', 'You clicked the button.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Rewards page!</Text>
      <Button title="Click Me" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default HomePage;
