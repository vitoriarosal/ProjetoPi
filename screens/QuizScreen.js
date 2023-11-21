import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AsyncStorage } from 'react-native';


const QuizScreen = ({ route }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [scorePlayer1, setScorePlayer1] = useState(0);
  const [scorePlayer2, setScorePlayer2] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [ranking, setRanking] = useState([]);

  const { userNamePlayer1, userNamePlayer2 } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const charactersResponse = await axios.get('https://hp-api.onrender.com/api/characters');
        const characters = charactersResponse.data.slice(5, 15);

        const quizQuestions = characters.map((character, index) => {
          const incorrectOptions = characters
            .filter((c) => c !== character)
            .slice(0, 3)
            .map((c) => c.name);

          const options = [character.name, ...incorrectOptions];
          const shuffledOptions = options.sort(() => Math.random() - 0.5);

          return {
            question: `Qual é o nome do personagem na imagem ${index + 1}?`,
            options: shuffledOptions,
            correctAnswer: character.name,
            imageUrl: character.image,
          };
        });

        const spellsResponse = await axios.get('https://hp-api.onrender.com/api/spells');
        const spells = spellsResponse.data.slice(0, 4);

        const spellQuestions = spells.map((spell, index) => {
          const incorrectOptions = spells
            .filter((s) => s !== spell)
            .slice(0, 3)
            .map((s) => s.name);

          const options = [spell.name, ...incorrectOptions];
          const shuffledOptions = options.sort(() => Math.random() - 0.5);

          return {
            question: `Qual é o feitiço "${spell.name}" usado para?`,
            options: shuffledOptions,
            correctAnswer: spell.effect,
            imageUrl: spell.type,
          };
        });

        const houseQuestions = characters.slice(5, 10).map((character) => {
          return {
            question: `${character.name} é da casa:`,
            options: ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'],
            correctAnswer: character.house,
            imageUrl: character.image,
          };
        });

        setQuestions([...quizQuestions, ...spellQuestions, ...houseQuestions]);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[questionIndex];

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      if (questionIndex % 2 === 0) {
        setScorePlayer1(scorePlayer1 + 1);
      } else {
        setScorePlayer2(scorePlayer2 + 1);
      }

      setShowSuccess(true);
      setShowError(false);
    } else {
      setShowError(true);
      setShowSuccess(false);
    }

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuizFinished(true);
      updateRanking();
    }
  };

  const handleNextQuestion = () => {
    setShowError(false);
    setShowSuccess(false);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuizFinished(true);
      updateRanking();
    }
  };

  const updateRanking = () => {
    const updatedRanking = [
      ...ranking,
      { name: userNamePlayer1, score: scorePlayer1 },
      { name: userNamePlayer2, score: scorePlayer2 }
    ];
    updatedRanking.sort((a, b) => b.score - a.score);
    const trimmedRanking = updatedRanking.slice(0, 5);
    setRanking(trimmedRanking);
  };

  const handleShowResult = () => {
    navigation.navigate('Resultado', { scorePlayer1, scorePlayer2, ranking });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando perguntas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentQuestion.imageUrl && (
        <Image source={{ uri: currentQuestion.imageUrl }} style={styles.characterImage} />
      )}
      <Text style={styles.question}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswer(option)}
            style={styles.optionButton}
          >
            <Text style={styles.optionButtonText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {showError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Você errou!</Text>
          <TouchableOpacity onPress={handleNextQuestion} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Próxima Pergunta</Text>
          </TouchableOpacity>
        </View>
      )}
      {showSuccess && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>Você acertou!</Text>
        </View>
      )}
      {quizFinished && (
        <View style={styles.finishContainer}>
          <Text style={styles.finishText}>
            Quiz finalizado! {userNamePlayer1} acertou {scorePlayer1} pergunta(s), {userNamePlayer2} acertou {scorePlayer2} pergunta(s).
          </Text>
          <TouchableOpacity onPress={handleShowResult} style={styles.finishButton}>
            <Text style={styles.finishButtonText}>Ver Resultado</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  optionsContainer: {
    width: '80%',
    marginBottom: 20,
  },
  optionButton: {
    marginBottom: 10,
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 8,
  },
  optionButtonText: {
    fontSize: 16,
  },
  errorContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'red',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
  successContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  successText: {
    fontSize: 18,
    color: 'blue',
  },
  finishContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishText: {
    fontSize: 18,
    marginBottom: 10,
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default QuizScreen;
