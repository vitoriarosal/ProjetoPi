// src/screens/CharacterQuizScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Image } from 'react-native';

const CharacterQuizScreen = ({ route, navigation }) => {
  const { character } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const questions = [
    {
      text: 'Qual é a casa de Hogwarts de ' + character.name + '?',
      options: ['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'],
      correctAnswer: 'Gryffindor',
    },
    // Adicione mais perguntas conforme necessário
  ];

  const handleAnswer = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (selectedAnswer === currentQuestion.correctAnswer) {
      // Lógica para resposta correta
      console.log('Resposta correta!');
    } else {
      // Lógica para resposta incorreta
      console.log('Resposta incorreta. Tente novamente!');
    }

    // Avança para a próxima pergunta
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {currentQuestionIndex < questions.length ? (
        <CharacterQuiz
          character={character}
          question={questions[currentQuestionIndex]}
          onAnswer={handleAnswer}
        />
      ) : (
        <View>
          <Text>Quiz Concluído!</Text>
          <Button
            title="Retornar à seleção de personagem"
            onPress={() => navigation.goBack()}
          />
        </View>
      )}
    </View>
  );
};

const CharacterQuiz = ({ character, question, onAnswer }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text>Pergunta: {question.text}</Text>
      {/* Exibe a foto do personagem */}
      {character.image && (
        <>
          <Text>URL da imagem: {character.image}</Text>
          <Image source={{ uri: character.image }} style={{ width: 200, height: 200 }} />
        </>
      )}
      {/* Adiciona opções de resposta */}
      {question.options.map((option) => (
        <Button key={option} title={option} onPress={() => onAnswer(option)} />
      ))}
    </View>
  );
};

export default CharacterQuizScreen;
