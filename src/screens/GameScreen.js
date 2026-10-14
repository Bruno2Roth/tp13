import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Flag from '../components/Flag';
import Feedback from '../components/Feedback';
import GuessForm from '../components/GuessForm';
import Hint from '../components/Hint';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function GameScreen() {
  const { mode, finishGame, playerName } = useGame();

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>PARTIDA DE {mode === 'capitals' ? 'CAPITALES' : 'BANDERAS'}</Text>
          <Text style={styles.title}>¡Vamos, {playerName}!</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={finishGame} style={styles.finishButton}>
          <Text style={styles.finishText}>Terminar</Text>
        </Pressable>
      </View>

      <ScoreBoard />
      <Timer />
      <Flag />
      <GuessForm />
      <Hint />
      <Feedback />
      <Text style={styles.footer}>Un acierto suma 10 puntos más los segundos que te queden.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.background, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  kicker: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 22, fontWeight: '900', marginTop: 4, maxWidth: 230 },
  finishButton: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  finishText: { color: colors.muted, fontSize: 12, fontWeight: '800' },
  footer: { color: colors.muted, fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 18 },
});
