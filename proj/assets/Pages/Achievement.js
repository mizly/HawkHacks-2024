// components/Achievements.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from './config';
import { PLAYER_ID } from './config';
const API_URL = `${BASE_URL}/get_player/${PLAYER_ID}`;

const Achievements = () => {
  const [achievements, setAchievements] = useState({});

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const achievementsData = JSON.parse(data.data.achievements);
        setAchievements(achievementsData);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      }
    };

    fetchAchievements();
  }, []);

  const renderAchievement = ({ item }) => {
    const [title, subtitle] = item[0].split(':').map(str => str.trim()); // Split and trim the title and subtitle
    return (
      <View style={styles.achievementItem}>
        <View style={styles.achievementTextContainer}>
          <Text style={styles.achievementText}>{title}</Text>
          {subtitle && <Text style={styles.achievementSubtitle}>{subtitle}</Text>}
        </View>
        {item[1] ? (
          <Icon name="trophy" size={24} color="#FEEC65" style={styles.icon} />
        ) : (
          <Icon name="trophy" size={24} color="#888" style={[styles.icon]} />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Achievements</Text>
      <FlatList
        data={Object.entries(achievements)}
        renderItem={renderAchievement}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#798777',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eeeeee',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  listContainer: {
    alignItems: 'center',
  },
  achievementItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#A2B29F',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  achievementTextContainer: {
    flexDirection: 'column',
  },
  achievementText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#eeeeee',
  },
  achievementSubtitle: {
    fontSize: 14,
    color: '#eeeeee',
  },
  icon: {
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default Achievements;
