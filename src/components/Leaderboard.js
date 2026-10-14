import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function Leaderboard() {
  const { ranking } = useGame();

  if (!ranking.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Todavía no hay resultados</Text>
        <Text style={styles.emptyText}>Terminá una partida para aparecer en el ranking.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {ranking.map((entry, index) => (
        <View key={entry.id} style={styles.row}>
          <Text style={styles.position}>{String(index + 1).padStart(2, '0')}</Text>
          <View style={styles.player}>
            <Text style={styles.name} numberOfLines={1}>{entry.name}</Text>
            <Text style={styles.date}>{new Date(entry.date).toLocaleDateString('es-AR')}</Text>
          </View>
          <Text style={styles.score}>{entry.score} pts</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, padding: 22, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  list: { gap: 9 },
  row: { minHeight: 64, flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, paddingHorizontal: 14 },
  position: { color: colors.accent, fontSize: 16, fontWeight: '900', width: 38 },
  player: { flex: 1, paddingRight: 8 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800' },
  date: { color: colors.muted, fontSize: 11, marginTop: 3 },
  score: { color: colors.accent, fontSize: 16, fontWeight: '900' },
});
