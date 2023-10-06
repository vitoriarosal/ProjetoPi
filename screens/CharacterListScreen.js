// src/components/CharacterList.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import axios from 'axios';

const CharacterList = ({ navigation }) => {
  const [randomCharacter, setRandomCharacter] = useState(null);

  useEffect(() => {
    axios.get('https://hp-api.onrender.com/api/characters')
      .then(response => {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const selectedCharacter = response.data[randomIndex];
        setRandomCharacter(selectedCharacter);
      })
      .catch(error => {
        console.error('Erro ao obter personagens:', error);
      });
  }, []);

  const startQuiz = () => {
    navigation.navigate('CharacterQuiz', { character: randomCharacter });
  };

  return (
    <View style={styles.container}>
      {randomCharacter && (
        <Image
          source={{ uri: randomCharacter.image }}
          style={styles.characterImage}
        />
      )}
      <Text style={styles.sectionTitle}>Iniciar Quiz</Text>
      <TouchableOpacity
        style={styles.startQuizButton}
        onPress={startQuiz}
      >
        <Text style={styles.startQuizButtonText}>Iniciar Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  startQuizButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  startQuizButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CharacterList;
