import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

const HomePage = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handlePress = () => {
    setLoading(true);
    fetch('http://172.20.10.3:5000/get_player/6648ab4c3b52e76987d2333f')  // Replace with your API URL
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        setData(json);
        Alert.alert('API Call Success', 'Data fetched successfully');
      })
      .catch(error => {
        setLoading(false);
        Alert.alert('API Call Error', 'An error occurred while fetching data');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the History page!</Text>
      <Button title="Click Me" onPress={handlePress} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {data && <Text>{JSON.stringify(data, null, 2)}</Text>}
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
