import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const QuizScreen = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const navigation = useNavigation();

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // API de personagens
        const charactersResponse = await axios.get('https://hp-api.onrender.com/api/characters');
        const characters = charactersResponse.data.slice(0, 4);

        const quizQuestions = characters.map((character, index) => {
          const incorrectOptions = characters
            .filter((c) => c !== character)
            .slice(0, 3)
            .map((c) => c.name);

          const options = [character.name, ...incorrectOptions];
          const shuffledOptions = shuffleArray(options);

          return {
            question: `Qual é o nome do personagem na imagem ${index + 1}?`,
            options: shuffledOptions,
            correctAnswer: character.name,
            imageUrl: character.image,
          };
        });

        // API de feitiços
        const spellsResponse = await axios.get('https://hp-api.onrender.com/api/spells');
        const spells = spellsResponse.data.slice(0, 4);

        // Pergunta sobre feitiços 1
        const wrongOptionsSpell1 = spells.filter((f) => f.name !== 'Aberto').slice(0, 3).map((f) => f.name);
        const spellQuestion1 = {
          question: 'Qual feitiço abre portas trancadas?',
          options: ([
            'Aberto', // Opção correta
            ...wrongOptionsSpell1]),
          correctAnswer: 'Aberto',
          imageUrl: spells[0]?.type,
        };

        // Pergunta sobre feitiços 2
        const wrongOptionsSpell2 = spells.filter((f) => f.name !== 'Crinus Muto').slice(0, 3).map((f) => f.name);
        const spellQuestion2 = {
          question: 'Qual feitiço muda o cabelo e o estilo?',
          options: ([
            'Crinus Muto', // Opção correta
            ...wrongOptionsSpell2]),
          correctAnswer: 'Crinus Muto',
          imageUrl: spells[2]?.type,
        };

        // Pergunta sobre casa em Gryffindor
        const houseQuestion = {
          question: `${characters[2].name} é da casa:`,
          options: shuffleArray(['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']),
          correctAnswer: 'Gryffindor',
          imageUrl: characters[2].image,
        };

        setQuestions([...quizQuestions, spellQuestion1, spellQuestion2, houseQuestion]);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[questionIndex];

  const handleAnswer = (selectedAnswer) => {
    // Lógica de resposta existente
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1);
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
    }
  };

  const handleNextQuestion = () => {
    // Lógica para avançar para a próxima pergunta existente
    setShowError(false);
    setShowSuccess(false);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleQuizFinished = () => {
    // Lógica quando o quiz é finalizado existente
    setQuizFinished(true);
  };

  const handleShowResult = () => {
    navigation.navigate('Resultado', { score });
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
            Quiz finalizado! Você acertou {score} pergunta(s).
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