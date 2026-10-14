import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function Feedback() {
  const { feedback } = useGame();
  if (!feedback) return null;

  const tone = feedback.type === 'correct'
    ? styles.correct
    : feedback.type === 'wrong' || feedback.type === 'timeout'
      ? styles.danger
      : styles.hint;

  return (
    <View style={[styles.box, tone]}>
      <Text style={styles.text}>{feedback.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { width: '100%', borderRadius: 12, padding: 12, marginTop: 12, borderWidth: 1 },
  correct: { backgroundColor: '#12382F', borderColor: colors.success },
  danger: { backgroundColor: '#3B242C', borderColor: colors.danger },
  hint: { backgroundColor: '#3B3320', borderColor: colors.accent },
  text: { color: colors.text, textAlign: 'center', fontSize: 14, fontWeight: '700' },
});
