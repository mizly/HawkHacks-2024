import React, { useRef, useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Modal, ScrollView, TouchableOpacity, Text, TextInput, Animated, Linking, } from 'react-native';
import * as Location from 'expo-location';
import Svg, {Path} from "react-native-svg";
import ProgressBar from 'react-native-progress/Bar';
import axios from 'axios';
import { Image } from 'react-native';
import { BASE_URL } from './config';
import Camera from './Camera.js';

const Autocomplete = ({ searchText, onSelect, lat, lng }) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (searchText) {
      fetchSuggestions(searchText, lat, lng);
    }
  }, [searchText]);

  const fetchSuggestions = async (text, lat, lng) => {
    if (lat == null || lng == null) {
      return;
  }
    try {
      const COORDINATES = `${lat},${lng}`;
      const API_URL = `${BASE_URL}/autocomplete/${text}/${COORDINATES}`;
      console.log(API_URL);
      const response = await fetch(API_URL);

      const result = await response.json();
      setSuggestions(result.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    onSelect(suggestion);
  };

  return (
    <ScrollView styles={{minHeight: 120, maxHeight: 150}}>
      {suggestions && suggestions.map((suggestion, index) => (
        <View key={index} style={styles.suggestionBox}>
          <TouchableOpacity key={index} onPress={() => handleSelectSuggestion(suggestion)}>
            <Text>{suggestion.main_text}</Text>
            <Text>{suggestion.secondary_text}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default function MapComponent(navigation) {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [locStatus, setLocStatus] = useState(false);
  const [businessMarkers, setBusinessMarkers] = useState([]);
  const mapRef = useRef(null);
  const [isTasksVisible, setIsTasksVisible] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [neighbourhood, setNeighbourhood] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchBarPosition = useRef(new Animated.Value(0)).current;
  const suggestionsPosition = useRef(new Animated.Value(0)).current;
  const [searchText, setSearchText] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState({});
  const [businessID, setBusinessID] = useState('');
  const [businessDetails, setBusinessDetails] = useState({});
  const [businessPhotos, setBusinessPhotos] = useState([]);
  const locationIntervalRef = useRef(null);
  const [showCheckInButton, setShowCheckInButton] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // const passback = (lat,lng) => props.navigate(lat,lng);
  // const navigateToInfoCard = () => {
  //   passback(latitude, longitude);
  // }
  
  useEffect(() => {
    const fetchNearBusinesses = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
        } else {
          let location = await Location.getLastKnownPositionAsync({});
          setLocStatus(true);
          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
          const queries = ['restaurant', 'cafe', 'bar', 'groceries', 'gym', 'pub', 'art', 'landmark', 'hotel', 'park', 'fair', 'market', 'bakeries', 'florists', 'pharmacies', 'asian cuisine', 'mediterranean cuisine', 'middle eastern cuisine', 'european cuisine', 'bookstores', 'clothing stores', 'electronics stores', 'furniture stores', 'jewelry stores', 'pet stores', 'shoe stores', 'video game stores']
          const index = Math.floor(Math.random() * queries.length);
          const API_URL = `${BASE_URL}/search_nearby/${queries[index]}/${location.coords.latitude}/${location.coords.longitude}`;
          console.log(API_URL);
          const response = await fetch(API_URL);

          const result = await response.json();
          console.log(result.data);
          const coordinatesList = result.data.map(item => ({
            latitude: item.latitude,
            longitude: item.longitude,
            title: item.name,
            description: item.address,
            place_id: item.place_id,
          }));
          setBusinessMarkers(coordinatesList);
          let avgLatitude = 0;
          let avgLongitude = 0;

          coordinatesList.forEach(marker => {
            avgLatitude += marker.latitude;
            avgLongitude += marker.longitude;
          });

          avgLatitude /= coordinatesList.length;
          avgLongitude /= coordinatesList.length;
          
          // Calculate distance between markers
          let maxDistance = 0;
          coordinatesList.forEach(marker1 => {
            coordinatesList.forEach(marker2 => {
              const distance = Math.sqrt(Math.pow(marker1.latitude - marker2.latitude, 2) + Math.pow(marker1.longitude - marker2.longitude, 2));
              if (distance > maxDistance) {
                maxDistance = distance;
              }
            });
          });
          
          // Set map region to encompass all markers
          let region = {
            latitude: avgLatitude,
            longitude: avgLongitude,
            latitudeDelta: maxDistance * 1.2, // Adding some padding
            longitudeDelta: maxDistance * 1.2,
          };

          mapRef.current.animateToRegion(region, 500);
        }
      } catch (error) {
        console.error('Error fetching nearest businesses:', error);
      }
    };

    if (latitude === 0 && longitude === 0) {
      fetchNearBusinesses(latitude, longitude);
    }
  }, []);

  const toggleTasks = () => {
    setIsTasksVisible(!isTasksVisible);
    setShowCheckInButton(false);
  };

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
    } else {
      let location = await Location.getLastKnownPositionAsync({});
      setLocStatus(true);
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922, // adjust these values as needed for zoom level
          longitudeDelta: 0.0421, // adjust these values as needed for zoom level
        },
        1500 // duration in milliseconds
      );
    }
  }

  const startLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 0,
      },
      (location) => {
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
        // mapRef.current.animateToRegion(
        //   {
        //     latitude: location.coords.latitude,
        //     longitude: location.coords.longitude,
        //     latitudeDelta: 0.0922, // adjust these values as needed for zoom level
        //     longitudeDelta: 0.0421, // adjust these values as needed for zoom level
        //   },
        //   1500 // duration in milliseconds
        // );
        // console.log('Location updated:', location.coords); // disable if too annoying
      }
    );
  };

  useEffect(() => {
    startLocationUpdates();
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  const handleSearchFocus = () => {
    getLocation();
    setShowCheckInButton(false);
    setIsSearchFocused(true);
    Animated.timing(searchBarPosition, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(suggestionsPosition, {
      toValue: -150,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Animated.timing(searchBarPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(suggestionsPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleSuggestion = async (suggestion) => {
    console.log(suggestion);
    setSelectedSuggestion(suggestion);
    setSearchText(suggestion.main_text);
    setBusinessMarkers([{ latitude: suggestion.latitude, longitude: suggestion.longitude, title: suggestion.main_text, description: suggestion.address, place_id: suggestion.place_id}]);
    let avgLatitude = 0;
    let avgLongitude = 0;

    const updatedMarkers = [{ latitude: suggestion.latitude, longitude: suggestion.longitude }, { latitude: latitude, longitude: longitude}];

    updatedMarkers.forEach(marker => {
      avgLatitude += marker.latitude;
      avgLongitude += marker.longitude;
    });

    avgLatitude /= updatedMarkers.length;
    avgLongitude /= updatedMarkers.length;
    
    // Calculate distance between markers
    let maxDistance = 0;
    updatedMarkers.forEach(marker1 => {
      updatedMarkers.forEach(marker2 => {
        const distance = Math.sqrt(Math.pow(marker1.latitude - marker2.latitude, 2) + Math.pow(marker1.longitude - marker2.longitude, 2));
        if (distance > maxDistance) {
          maxDistance = distance;
        }
      });
    });
    
    // Set map region to encompass all markers
    let region = {
      latitude: avgLatitude,
      longitude: avgLongitude,
      latitudeDelta: maxDistance * 1.2, // Adding some padding
      longitudeDelta: maxDistance * 1.2,
    };

    mapRef.current.animateToRegion(region, 500);
    try {
      const ORIGIN_URL = `${BASE_URL}/business_details/${suggestion.place_id}`
      console.log(ORIGIN_URL);
      const response = await axios.get(ORIGIN_URL);
      console.log(response);
      setBusinessDetails(response.data.data[0]);

      

      // BASE_URL = 'http://192.168.2.13:5000/business_photos';
      // API_URL = `${BASE_URL}/${suggestion.place_id}}`;
      // console.log(API_URL);
      // response = await fetch(API_URL);
      // result = await response.json();
      // console.log(result.data);
      // setBusinessPhotos(result.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
    Animated.timing(searchBarPosition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsInfoVisible(true);
  }

  const MAX_DISTANCE_THRESHOLD = 3; // Adjust this value as needed

  // Calculate the distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Convert degrees to radians
  const toRadians = (deg) => {
    return deg * (Math.PI / 180);
  };

  // Determine if a business marker is within the specified distance from the user
  const isWithinDistance = (businessMarker) => {
    const distance = calculateDistance(latitude, longitude, businessMarker.latitude, businessMarker.longitude);
    // console.log("distance: ", distance);
    return distance <= MAX_DISTANCE_THRESHOLD;
  };

  useEffect(() => {
    console.log("showCheckInButton has changed:", showCheckInButton);
  }, [showCheckInButton]);

  const handleCheckIn = async (businessID) => {
    console.log("BUTTON HAS BEEN PRESSED! OPEN CAMERA PLEASE!");
    console.log("Business ID:", businessID);
    setShowCamera(true);
    console.log("Camera has been opened!");
  };

  return (
    <>

      <View style={styles.container}>

        <Animated.View style={[styles.searchContainer, { transform: [{ translateY: searchBarPosition }] }]}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
        </Animated.View>

        {searchText !== '' && (
          <Animated.View style={[ styles.suggestionsContainer, { transform: [{ translateY: suggestionsPosition }] }]}>
            <Autocomplete searchText={searchText} onSelect={(suggestion) => handleSuggestion(suggestion)} lat={latitude} lng={longitude} />
          </Animated.View>
        )}

        <Modal
          visible={isTasksVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleTasks}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
              <ScrollView>
                <View style={styles.header}>
                  <Text style={styles.headerText}>Daily Tasks</Text>
                  <TouchableOpacity onPress={toggleTasks}>
                    <Svg onPress={toggleTasks} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <Path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <Path d="M12 3L21 12L12 21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>

                <View style={styles.taskContainer}>
                  <View style={styles.taskCard}>
                    <Text style={styles.taskTitle}>Discover new local businesses (7/10)</Text>
                    <Text style={styles.taskSubtitle}>10 xp</Text>
                    <ProgressBar progress={0.7} width={200} height={10} color={'#00ADB5'} />
                    <Text style={styles.progressText}>70% completed</Text>
                  </View>
                  
                  <View style={styles.taskCard}>
                    <Text style={styles.taskTitle}>Explore business in a new area (1/4)</Text>
                    <Text style={styles.taskSubtitle}>20 xp</Text>
                    <ProgressBar progress={0.2} width={200} height={10} color={'#00ADB5'} />
                    <Text style={styles.progressText}>25% progress</Text>
                  </View>

                  <View style={styles.taskCard}>
                    <Text style={styles.taskTitle}>Visit a local business' website (0/1)</Text>
                    <Text style={styles.taskSubtitle}>30 xp</Text>
                    <ProgressBar progress={0} width={200} height={10} color={'#00ADB5'} />
                    <Text style={styles.progressText}>0% progress</Text>
                  </View>
                </View>

              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          visible={isInfoVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={toggleInfo}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%', maxHeight: '80%' }}>
            {businessDetails && (
              <ScrollView>
                <TouchableOpacity onPress={toggleInfo} style={{ alignSelf: 'flex-end' }}>
                  <Svg onPress={toggleInfo} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M3 12H21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <Path d="M12 3L21 12L12 21" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </TouchableOpacity>

                <Text style={{ fontSize: 32, textAlign: 'left', marginBottom: 10, fontWeight: 'bold', color: 'blue' }}>{businessDetails.name}</Text>

                <Text style={{ fontSize: 16, textAlign: 'left', marginBottom: 10 }}>Rating {businessDetails.rating} out of 5.0</Text>

                <Text style={{ fontSize: 16, marginBottom: 10 }}>{businessDetails.address}</Text>

                <Text style={{ fontSize: 16, marginBottom: 10 }}>{businessDetails.opening_status}</Text>

                <Text style={{ fontSize: 16, marginBottom: 10 }}>Rating: {businessDetails.rating}</Text>
                <TouchableOpacity onPress={() => Linking.openURL(businessDetails.reviews_link)}>
                  <Text style={{ color: '#234beb', fontSize: 16, marginBottom: 10 }}>Read Reviews</Text>
                </TouchableOpacity>

                {businessDetails.phone_number && (
                  <Text style={{ fontSize: 16, marginBottom: 10 }}>Phone: {businessDetails.phone_number}</Text>
                )}

                <TouchableOpacity onPress={() => Linking.openURL(businessDetails.website)} style={{ marginTop: 20, backgroundColor: '#234beb', borderRadius: 10, paddingVertical: 10 }}>
                  <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>Website</Text>
                </TouchableOpacity>

                {/* <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>Additional Details</Text>
                <Text style={{ fontSize: 16 }}>Accessibility: {businessDetails.about.details.Accessibility}</Text>
                <Text style={{ fontSize: 16 }}>Payments: {businessDetails.about.details.Payments}</Text>
                <Text style={{ fontSize: 16 }}>Service options: {businessDetails.about.details["Service options"]}</Text> */}
              </ScrollView>
            )}
            </View>
          </View>
        </Modal>

        <View style={styles.mapContainer}>
          <MapView style={styles.map} ref={mapRef}>
            {locStatus ? (
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title="Me"
                description="My location">
                  <Image source={require('../home.png')} style={{ width: 50, height: 50 }} />
              </Marker>
            ) : null}
            {businessMarkers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title || 'Business'}
                description={marker.description}
                onPress={() => {
                  if (isWithinDistance(marker)) {
                    setShowCheckInButton(true);
                    setBusinessID(marker.place_id);
                    mapRef.current.animateToRegion({
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    });
                  } else {
                    setShowCheckInButton(false);
                  }
                }}
              >
                <Image source={isWithinDistance(marker) ? require('../nearby_marker.webp') : require('../marker.webp')} style={{ width: 50, height: 50 }} />
              </Marker>
            ))}
          </MapView>
        </View>

        {showCamera && (
          <Camera style={{ zIndex: 5 }} />
        )}

        {showCheckInButton && (
          <TouchableOpacity
            style={styles.checkInButton}
            onPress={() => handleCheckIn(businessID)}
          >
            <Text style={styles.checkInButtonText}>Check In</Text>
          </TouchableOpacity>
        )}

        <View style={styles.taskButtonContainer}>
          <TouchableOpacity
            style={styles.taskButton}
            onPress={toggleTasks}>
            <Svg width="64" height="64" viewBox="0 0 83 83" fill="none" xmlns="http://www.w3.org/2000/svg">
              <Path d="M83 41.5C83 64.4198 64.4198 83 41.5 83C18.5802 83 0 64.4198 0 41.5C0 18.5802 18.5802 0 41.5 0C64.4198 0 83 18.5802 83 41.5Z" fill="#00ADB5"/>
              <Path d="M63.4981 19.5031L70.1974 20.8424C70.5571 20.9143 70.8529 21.1782 70.9569 21.534C71.0094 21.7068 71.014 21.8907 70.9704 22.0659C70.9267 22.2412 70.8364 22.4014 70.709 22.5294L65.2209 28.0225C64.5643 28.678 63.6744 29.0461 62.7466 29.0459H58.1938L46.7619 40.4837C46.98 41.3073 47.0201 42.168 46.8795 43.0084C46.739 43.8487 46.421 44.6495 45.9468 45.3573C45.4725 46.0651 44.8529 46.6637 44.1292 47.1132C43.4055 47.5627 42.5944 47.8529 41.7498 47.9642C40.9052 48.0756 40.0466 48.0057 39.2311 47.7592C38.4156 47.5127 37.6621 47.0952 37.0206 46.5345C36.3791 45.9739 35.8644 45.2829 35.5109 44.5077C35.1573 43.7325 34.973 42.8909 34.9702 42.0388C34.9708 41.1189 35.1829 40.2114 35.59 39.3865C35.9972 38.5616 36.5885 37.8414 37.3183 37.2815C38.0481 36.7216 38.8968 36.337 39.7989 36.1575C40.701 35.9779 41.6323 36.0082 42.5209 36.246L53.9568 24.8042V20.2587C53.9568 19.3312 54.3246 18.4397 54.9801 17.784L60.4722 12.291C60.6003 12.1636 60.7604 12.0733 60.9357 12.0296C61.1109 11.986 61.2947 11.9906 61.4675 12.0431C61.8233 12.1471 62.0871 12.4429 62.159 12.8027L63.4981 19.5031Z" fill="#FFFDEF"/>
              <Path d="M16.9829 42.0388C16.987 45.4688 17.7265 48.858 19.1516 51.9778C20.5767 55.0976 22.6542 57.8755 25.244 60.124C27.8337 62.3725 30.8755 64.0394 34.1641 65.0122C37.4527 65.9849 40.9117 66.241 44.3077 65.7631C47.7037 65.2852 50.9577 64.0844 53.8502 62.2417C56.7427 60.3991 59.2065 57.9574 61.0753 55.0814C62.9441 52.2054 64.1745 48.9621 64.6835 45.5701C65.1925 42.1781 64.9682 38.7164 64.0258 35.4184C63.8935 35.0331 63.8409 34.6249 63.8714 34.2187C63.9018 33.8124 64.0146 33.4166 64.2029 33.0554C64.3912 32.6941 64.651 32.3749 64.9666 32.1173C65.2821 31.8597 65.6468 31.669 66.0383 31.5568C66.4299 31.4446 66.8402 31.4134 67.2443 31.4648C67.6483 31.5163 68.0377 31.6495 68.3886 31.8563C68.7396 32.0631 69.0448 32.3392 69.2857 32.6677C69.5265 32.9963 69.698 33.3704 69.7897 33.7673C71.6145 40.154 71.2679 46.9658 68.8042 53.1341C66.3405 59.3025 61.8992 64.4783 56.1769 67.8496C50.4547 71.221 43.7754 72.597 37.1869 71.7619C30.5983 70.9268 24.4734 67.9277 19.7729 63.2353C15.0776 58.5353 12.0758 52.4088 11.2389 45.8176C10.402 39.2265 11.7774 32.544 15.1491 26.8194C18.5207 21.0947 23.6978 16.6521 29.8674 14.1889C36.037 11.7258 42.8498 11.3816 49.2362 13.2105C49.9966 13.4328 50.6381 13.9472 51.0205 14.6411C51.403 15.3351 51.4952 16.1522 51.2771 16.914C51.0589 17.6757 50.5482 18.3202 49.8564 18.7064C49.1647 19.0927 48.3482 19.1894 47.5853 18.9753C44.0142 17.9506 40.2538 17.7695 36.6007 18.4463C32.9476 19.1231 29.5017 20.6394 26.5345 22.8756C23.5674 25.1118 21.1601 28.0068 19.5025 31.3323C17.845 34.6578 16.9824 38.323 16.9829 42.0388Z" fill="#FFFDEF"/>
              <Path d="M28.9744 42.0388C28.9746 44.2239 29.5714 46.3676 30.7002 48.2385C31.8291 50.1094 33.4472 51.6365 35.3802 52.6551C37.3131 53.6738 39.4874 54.1453 41.6685 54.0188C43.8497 53.8923 45.9549 53.1726 47.7572 51.9374C49.5591 50.699 50.9882 48.9915 51.89 46.9995C52.7918 45.0075 53.1319 42.8069 52.8736 40.6355C52.8037 40.1086 52.8755 39.5726 53.0816 39.0827C53.2877 38.5927 53.6206 38.1666 54.0461 37.8482C54.4716 37.5297 54.9743 37.3304 55.5024 37.2709C56.0305 37.2113 56.5649 37.2936 57.0506 37.5092C57.5362 37.7221 57.9567 38.0599 58.2692 38.4883C58.5817 38.9168 58.775 39.4204 58.8294 39.9479C59.2637 43.6583 58.5324 47.4119 56.7369 50.6877C54.9414 53.9635 52.1709 56.599 48.8098 58.2285C45.4487 59.8579 41.6638 60.4005 37.9804 59.7808C34.297 59.1612 30.8979 57.41 28.2547 54.7705C25.6116 52.1309 23.8556 48.7339 23.2304 45.0509C22.6053 41.3678 23.142 37.5815 24.7661 34.2174C26.3902 30.8533 29.0211 28.0783 32.2936 26.2776C35.5662 24.4768 39.318 23.7397 43.0285 24.1685C43.4258 24.2053 43.8117 24.3212 44.1637 24.5091C44.5157 24.6971 44.8266 24.9535 45.0782 25.2632C45.3298 25.5729 45.5171 25.9298 45.629 26.3128C45.741 26.6959 45.7753 27.0974 45.7301 27.4939C45.6849 27.8904 45.5609 28.2739 45.3656 28.6219C45.1703 28.9698 44.9074 29.2753 44.5925 29.5204C44.2776 29.7655 43.917 29.9452 43.5317 30.0491C43.1465 30.1529 42.7444 30.1788 42.349 30.1252C40.6688 29.9301 38.9663 30.0927 37.3534 30.6024C35.7405 31.112 34.2537 31.9572 32.9905 33.0823C31.7274 34.2075 30.7165 35.5872 30.0244 37.1308C29.3322 38.6744 28.9744 40.347 28.9744 42.0388Z" fill="#FFFDEF"/>
            </Svg>
          </TouchableOpacity>
        </View>
    {/* 
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === 'Location' && styles.selectedButton,
          ]}
          onPress={() => getLocation()}>
          <Text style={[styles.text, selectedButton === 'Location' && styles.selectedText]}>Location</Text>
        </TouchableOpacity> */}

        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLocationButtonClick}>
            <Text style={styles.text}>Find My Location</Text>
          </TouchableOpacity>
        </View> */}

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  taskButtonContainer:{
    position: 'absolute',
    top: 80,
    left: 15,
  },
  button:{
    position: 'absolute',
    bottom: 100,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#f7f5f5',
    borderRadius: 30,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskButton: {
    backgroundColor: 'transparent',
    borderRadius: 50,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  text: {
    fontSize: 24,
    fontWeight: 800,
    padding: 6,
  },
  selectedButton: {
    backgroundColor: '#234beb',
  },
  selectedText: {
    color: '#fff', // Text color when button is selected
  },


  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  taskContainer: {
    alignItems: 'center',
  },
  taskCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  progressText: {
    marginTop: 10,
    fontSize: 14,
  },
  searchContainer: {
    position: 'absolute',
    bottom: 100,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
  },
  searchBar: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 400,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
    zIndex: 1,
    maxHeight: 280,
  },
  suggestion: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionsScrollView: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 2,
  },
  suggestionBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  suggestionText: {
    fontSize: 16,
  },
  checkInButton: {
    position: 'absolute',
    bottom: 300,
    width: 200,
    height: 50,
    alignSelf: 'center',
    backgroundColor: '#00ADB5',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOpacity: 0.2, // For iOS shadow
    shadowOffset: { width: 0, height: 4 }, // For iOS shadow
    shadowRadius: 3.84,
  },
  checkInButtonText: {
    alignSelf: 'center',
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
