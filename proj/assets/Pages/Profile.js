import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, ScrollView, ActivityIndicator } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';

import PFP from "../TorontoPFP.png";
import PFP1 from "../PFP1.jpg";
import PFP2 from "../PFP2.png";
import PFP3 from "../PFP3.jpg";
import Park from "../park.png";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.20.10.3:5000/get_player/6648d44ff07f2066e21d9310'); // Replace with your API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={Park} style={styles.backgroundImage} blurRadius={10}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <View style={styles.photoContainer}>
              <Image source={{uri:data.document.profile_pic}} style={styles.circularPhoto} />
            </View>

            <Text style={styles.name}>{data.document.name || "Sally the Traveler"}</Text>
            <Text style={styles.username}>{data.document.username || "SallyX"}</Text>

            <View style={styles.xpContainer}>
              <View style={styles.levelCircle}>
                <Text style={styles.level}>{Math.floor(data.document.xp/100) || 1}</Text>
              </View>
              <View style={styles.xpBar}>
                <ProgressBar progress={(data.document.xp%100 || 0) / 100} width={300} height={20} borderRadius={20} color={'#6C5CE7'} />
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>
                {data.description || "Hey! I'm Sally the Traveler and I really love learning about my community. I'm also super passionate about equity, diversity, and inclusion."}
              </Text>

              <Text style={styles.headerText}>Friends List</Text>
              <View style={styles.friendsContainer}>
                {data.friends && data.friends.map((friend, index) => (
                  <View style={styles.friend} key={index}>
                    <Image source={friend.image || PFP1} style={styles.friendImage} />
                    <Text style={styles.friendName}>{friend.name || "Friend"}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    zIndex: -1, // Ensure the background image is behind other content
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 200, // Adjust the paddingTop to account for the background image height
  },
  photoContainer: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  circularPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'lightgray',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  username: {
    fontSize: 12,
    fontWeight: 'normal',
    marginBottom: 10,
  },
  xpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCircle: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#F7BD45',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    marginRight: -20,
    marginLeft: 30,
    backgroundColor: '#FEEC65',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  level: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  xpBar: {
    flex: 1,
    height: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  descriptionContainer: {
    padding: 20,
    backgroundColor: '#21264a',
    borderRadius: 25,
    marginTop: 30,
    width: '100%',
    paddingTop: 30,
    paddingBottom: 80,
  },
  descriptionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#ede3da',
    fontWeight: '500',
    marginTop: 10,
  },
  friendsContainer: {
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  friend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#6580eb',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '95%',
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightgray',
    marginRight: 10,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ede3da',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ede3da',
    textAlign: 'center',
    marginTop: 30,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
