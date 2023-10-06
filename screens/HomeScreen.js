// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [characterImage, setCharacterImage] = useState(null);

  useEffect(() => {
    const fetchCharacterImage = async () => {
      try {
        const response = await axios.get('https://hp-api.onrender.com/api/characters');
        const firstCharacterImage = response.data[0]?.image;

        if (firstCharacterImage) {
          setCharacterImage(firstCharacterImage);
        }
      } catch (error) {
        console.error('Erro ao buscar a imagem do personagem:', error);
      }
    };

    fetchCharacterImage();
  }, []);

  const startQuiz = () => {
    navigation.navigate('Quiz');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para iniciar o quiz, aperte no botão</Text>
      {characterImage && <Image source={{ uri: characterImage }} style={styles.characterImage} />}
      <Button title="Iniciar Quiz" onPress={startQuiz} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    color: 'red', // Cor vermelha
    fontFamily: 'Arial', // Fonte diferente (ajuste conforme as fontes disponíveis)
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
});

export default HomeScreen;
