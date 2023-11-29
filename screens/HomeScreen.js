import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [characterImage, setCharacterImage] = useState(null);
  const [userName, setUserName] = useState('');
  const [jogadores, setJogadores] = useState([]);

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
    if (userName.trim() === '') {
      alert('Por favor, insira seu nome antes de iniciar o quiz.'); 
      return;
    }
  
    console.log('Nome do Jogador:', userName);
  
    // Passei o nome do usuário para a tela do quiz
    navigation.navigate('Quiz', { userNamePlayer1: userName, jogadores });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Para iniciar o quiz, aperte no botão</Text>
      {characterImage && <Image source={{ uri: characterImage }} style={styles.characterImage} />}
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do primeiro jogador"
        value={userName}
        onChangeText={(text) => setUserName(text)}
      />    
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
    color: 'red',
    fontFamily: 'Arial',
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default HomeScreen;
