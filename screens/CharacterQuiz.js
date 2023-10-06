// src/components/CharacterQuiz.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const CharacterQuiz = ({ character, question, onNextQuestion }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAnswer = () => {
    if (selectedOption === question.correctAnswer) {
      Alert.alert('Resposta Correta!', 'Parabéns!');
    } else {
      Alert.alert('Resposta Incorreta!', `A resposta correta é ${question.correctAnswer}`);
    }

    // Limpar a seleção para a próxima pergunta
    setSelectedOption(null);

    // Chamar a função para a próxima pergunta
    onNextQuestion();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quiz:</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question.text}</Text>
        <Image source={{ uri: character.image }} style={styles.characterImage} />
      </View>
      <View style={styles.optionsContainer}>
        {question.options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedOption === option ? { backgroundColor: '#3498db' } : null,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleAnswer}>
        <Text style={styles.submitButtonText}>Enviar Resposta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos podem ser definidos aqui
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  characterImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CharacterQuiz;
