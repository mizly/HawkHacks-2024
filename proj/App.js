import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Footer from './assets/Pages/Footer';
import History from './assets/Pages/History';
import Profile from './assets/Pages/Profile';
import MapComponent from './assets/Pages/Map';
import Header from './assets/Pages/Header';
import Camera from './assets/Pages/Camera';
import Achievement from './assets/Pages/Achievement';
import FriendProfile from './assets/Pages/FriendProfile';

const Stack = createStackNavigator();

function MainStack({ navigation }) {
  const [page, setPage] = React.useState('Map');

  const backToMap = () => {
    setPage('Map');
  };

  const backToHistory = () => {
    setPage('History');
  };

  const route = useRoute();


  let currentPage = null;

  if (page === 'History') {
    currentPage = <History onOrange={(arr) => moveInfo(arr)} />;
  } else if (page === 'Map') {
    currentPage = (
      <>
        <View style={styles.mapContainer}>
          <MapComponent navigation={navigation} route={route} />
        </View>
        <View style={styles.pageContainer} />
      </>
    );
  } else if (page === 'Profile') {
    currentPage = <Profile navigation={navigation} />;
  } else if (page === 'Spotify') {
    currentPage = <Spotify data={infoCardData} navigate={backToMap} navigate0={backToHistory} />;
  } else if (page === 'Achievement') {
    currentPage = <Achievement />;
  } else if (page === 'Camera') {
    currentPage = <Camera/>;
  }

  return (
    <View style={styles.container}>
      {/*<Header />*/}
      {currentPage}
      <Footer onButtonPress={setPage} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainStack} options={{ headerShown: false }} />
        <Stack.Screen name="FriendProfile" component={FriendProfile} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="MapMain" component={Map}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  mapContainer: {
    height: '100%',
  },
  pageContainer: {
    height: '50%',
  },
});
