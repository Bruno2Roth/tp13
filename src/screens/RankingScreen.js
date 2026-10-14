import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Leaderboard from '../components/Leaderboard';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function RankingScreen() {
  const { returnHome } = useGame();

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>MEJORES PARTIDAS</Text>
          <Text style={styles.title}>Ranking</Text>
        </View>
        <Text style={styles.badge}>TOP 10</Text>
      </View>
      <Leaderboard />
      <Pressable accessibilityRole="button" onPress={returnHome} style={styles.button}>
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </Pressable>
      <Text style={styles.note}>Los resultados se guardan en este dispositivo.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.background, paddingHorizontal: 22, paddingTop: 30, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  kicker: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 4 },
  badge: { color: colors.accent, fontSize: 11, fontWeight: '900', borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 7 },
  button: { minHeight: 50, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  buttonText: { color: colors.background, fontSize: 15, fontWeight: '900' },
  note: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 12 },
});
