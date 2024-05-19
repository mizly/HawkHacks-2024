import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import Park from "../park.png";

const BASE_URL = 'http://172.20.10.3:5000/get_player';
const PLAYER_ID = "6648db43f07f2066e226e0b5";
const API_URL = `${BASE_URL}/${PLAYER_ID}`;

export default function Profile({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [friendsData, setFriendsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!result.document) {
          throw new Error('Data is empty :c');
        }

        const friendsDetails = await Promise.all(
          result.document.friends.map(async (friendId) => {
            const friendResponse = await fetch(`${BASE_URL}/${friendId}`);
            return await friendResponse.json();
          })
        );

        setData(result.document);
        setFriendsData(friendsDetails);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
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
              <Image source={{ uri: data.profile_pic }} style={styles.circularPhoto} />
            </View>

            <Text style={styles.name}>{data.name || "Sally the Traveler"}</Text>
            <Text style={styles.username}>{data.username || "SallyX"}</Text>

            <View style={styles.xpContainer}>
              <View style={styles.levelCircle}>
                <Text style={styles.level}>{Math.floor(data.xp / 100) || 1}</Text>
              </View>
              <View style={styles.xpBar}>
                <ProgressBar progress={(data.xp % 100 || 0) / 100} width={300} height={20} borderRadius={20} color={'#00ADB5'} />
                <Text style={styles.xpText}>{`${data.xp % 100}/100` || "50/100"}</Text>
              </View>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.headerText}>Friends List</Text>
              <View style={styles.friendsContainer}>
                {friendsData.map((friend, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.friend}
                    onPress={() => navigation.navigate('FriendProfile', { friendId: friend.document._id })}
                  >
                    <Image source={{ uri: friend.document.profile_pic }} style={styles.friendImage} />
                    <Text style={styles.friendName}>{friend.document.name || "Friend"}</Text>
                    <View style={styles.friendLevelCircle}>
                <Text style={styles.level}>{Math.floor(data.xp / 100) || 1}</Text>
              </View>
                  </TouchableOpacity>
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
    backgroundColor: '#eee',
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
  xpText: {
    fontSize: 12,
    fontWeight: 'normal',
    marginLeft: 20,
    marginTop: 5
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
  friendLevelCircle: {
    width: 50,
    height: 50,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#F7BD45',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 1,
    marginRight: 0,  // Adjusted to remove negative margin
    marginLeft: 'auto',  // Added to push the element to the right
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
    backgroundColor: '#222831',
    borderRadius: 0,
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
    color: ""
  },
  friend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#00ADB5',
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
    color: '#eeeeee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#eeeeee',
    textAlign: 'left',
    marginTop: -10,
    marginLeft: 20
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
