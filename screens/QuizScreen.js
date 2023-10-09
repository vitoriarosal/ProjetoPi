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

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://hp-api.onrender.com/api/characters');
        const characters = response.data.slice(0, 4);

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

        // Adicione a nova pergunta "Harry e Hermione se beijaram nos filmes?"
        const kissQuestion = {
          question: 'Harry e Hermione se beijaram nos filmes?',
          options: ['Verdadeira', 'Falsa'],
          correctAnswer: 'Falsa',
          imageUrl: 'https://pbs.twimg.com/media/EloZGAkXIAU4fc5.jpg',
        };

        // Adicione a nova pergunta "Draco tem um irmão gêmeo?"
        const brotherQuestion = {
          question: 'Draco tem um irmão gêmeo?',
          options: ['Verdadeira', 'Falsa'],
          correctAnswer: 'Falsa',
          imageUrl: 'https://i.pinimg.com/originals/2c/f8/19/2cf8190c62b3027bed25741e5b3b8e69.jpg',
        };

        // Adicione a nova pergunta "Harry é da casa sonserina?"
        const brotherQuestion2 = {
          question: 'Harry é da casa sonserina?',
          options: ['Verdadeira', 'Falsa'],
          correctAnswer: 'Falsa',
          imageUrl: 'https://18854.cdn.simplo7.net/static/18854/sku/quadros-e-placas-decorativas-filmes-quadro-ou-placa-decorativa-harry-potter-sonserina--p-1569604280472.jpg',
        };

        // Adicione a nova pergunta "Hermione possuía uma mente acadêmica brilhante e se provou uma estudante talentosa, a ponto de ser considerada à Casa Corvinal.?"
        const brotherQuestion3 = {
          question: 'Hermione possuía uma mente acadêmica brilhante e se provou uma estudante talentosa, a ponto de ser considerada à Casa Corvinal.?',
          options: ['Verdadeira', 'Falsa'],
          correctAnswer: 'Verdadeira',
          imageUrl: 'https://rollingstone.uol.com.br/media/_versions/emma_watson_como_hermione_em_pedra_filosofal_reprod_warner_widelg.jpg',
        };

        setQuestions([...quizQuestions, kissQuestion, brotherQuestion, brotherQuestion2, brotherQuestion3]);
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
    setShowError(false);
    setShowSuccess(false);

    if (questionIndex + 1 < questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleQuizFinished = () => {
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

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

export default QuizScreen;
