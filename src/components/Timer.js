import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function Timer() {
  const { timer } = useGame();
  const progress = `${Math.max(0, (timer / 15) * 100)}%`;
  const timerColor = timer <= 5 ? colors.danger : colors.accent;

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>TIEMPO</Text>
        <Text style={[styles.value, { color: timerColor }]}>{`00:${String(timer).padStart(2, '0')}`}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: progress, backgroundColor: timerColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
  value: { fontSize: 18, fontWeight: '900', fontVariant: ['tabular-nums'] },
  track: { width: '100%', height: 7, backgroundColor: colors.border, borderRadius: 9, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: 9 },
});
