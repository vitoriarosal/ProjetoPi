// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const Quiz = () => {
  const [characters, setCharacters] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Faça a requisição à API ao montar o componente
    axios.get('https://hp-api.onrender.com/api/characters')
      .then(response => {
        setCharacters(response.data);
      })
      .catch(error => {
        console.error('Erro ao obter personagens:', error);
      });
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    // Vá para a próxima pergunta ou termine o quiz
    if (currentQuestion + 1 < characters.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Reinicie o quiz quando todas as perguntas foram respondidas
      setCurrentQuestion(0);
    }
  };

  if (currentQuestion >= characters.length) {
    // Se todas as perguntas foram respondidas, exiba o resultado
    return (
      <View style={styles.container}>
        <Text style={styles.result}>Quiz Concluído!</Text>
        <Text style={styles.result}>Pontuação: {score}/{characters.length}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{characters[currentQuestion].name}</Text>
      <Button title="Verdadeiro" onPress={() => handleAnswer(true)} />
      <Button title="Falso" onPress={() => handleAnswer(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Quiz;
