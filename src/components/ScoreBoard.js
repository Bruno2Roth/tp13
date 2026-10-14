import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function ScoreBoard() {
  const { playerName, score } = useGame();

  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>JUGADOR</Text>
        <Text style={styles.name} numberOfLines={1}>{playerName || 'Jugador'}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.scoreBox}>
        <Text style={styles.label}>PUNTOS</Text>
        <Text style={styles.score}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 18, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border,
  },
  label: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 4, maxWidth: 170 },
  divider: { width: 1, height: 36, backgroundColor: colors.border, marginHorizontal: 14 },
  scoreBox: { alignItems: 'flex-end' },
  score: { color: colors.accent, fontSize: 23, fontWeight: '900', marginTop: 1 },
});
