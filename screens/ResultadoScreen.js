import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { FlatList } from 'react-native';

const ResultadoScreen = ({ route }) => {
  const { score, ranking } = route.params;

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
      {ranking.length > 0 ? (
        <FlatList
          data={ranking}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <Text style={styles.resultText}>{`${index + 1}. ${item.name}: ${item.score} pontos`}</Text>
          )}
        />
      ) : (
        <Text style={styles.resultText}>Nenhum jogador no ranking ainda.</Text>
      )}
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
});

export default ResultadoScreen;
