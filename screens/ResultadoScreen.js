import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native';

const ResultadoScreen = ({ route, navigation }) => {
  const { score, ranking } = route.params;

  const updatedRanking = ranking.reduce((acc, player) => {
    const existingPlayer = acc.find((item) => item.name === player.name);
    
    if (existingPlayer) {
      existingPlayer.score += player.score;
    } else {
      acc.push({ name: player.name, score: player.score });
    }

    return acc;
  }, []);

  const sortedRanking = updatedRanking.sort((a, b) => b.score - a.score);

  const handleReiniciarQuiz = () => {
    // Reinicie o quiz configurando o estado para a tela de resultados
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://http2.mlstatic.com/D_NQ_NP_880019-MLB47263381930_082021-O.webp' }}
        style={styles.resultImage}
      />
      <Text style={styles.title}>PARABÉNS, VOCÊ FINALIZOU O QUIZ</Text>
      <Text style={styles.resultText}>
        Quiz finalizado! Você acertou {score} pergunta(s).
      </Text>
      <Text style={styles.resultText}>
        {score < 2 ? 'Você não é um fã de carteirinha.' : 'Você é um fã de carteirinha!'}
      </Text>

      <Text style={styles.resultText}>Ranking:</Text>
      {sortedRanking.length > 0 ? (
        <FlatList
          data={sortedRanking}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Text style={styles.resultText}>{`${index + 1}. ${item.name || 'Desconhecido'}: ${item.score} pontos`}</Text>
          )}
        />
      ) : (
        <Text style={styles.resultText}>Nenhum jogador no ranking ainda.</Text>
      )}

      <TouchableOpacity onPress={handleReiniciarQuiz} style={styles.reiniciarButton}>
        <Text style={styles.reiniciarButtonText}>Reiniciar o Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'orange',
  },
  resultImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'HarryP', // Use o nome da fonte que você adicionou ao projeto
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultText: {
    fontFamily: 'HarryP',
    fontSize: 18,
    marginBottom: 10,
  },
  reiniciarButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  reiniciarButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ResultadoScreen;
