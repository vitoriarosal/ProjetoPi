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
          source={{ uri: `${randomCharacter.image}?timestamp=${new Date().getTime()}` }}
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
  // ... (seus estilos)
});

export default CharacterList;
