import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function Hint() {
  const { mode, timer, requestHint } = useGame();
  if (mode === 'capitals') {
    return <Text style={styles.note}>Cada 5 segundos se elimina una opción incorrecta.</Text>;
  }

  const disabled = timer <= 2;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={requestHint}
      disabled={disabled}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={styles.buttonText}>{disabled ? 'Sin tiempo para pedir pista' : 'Pedir pista  ·  −2 s'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 42, paddingHorizontal: 16, alignSelf: 'center', justifyContent: 'center', marginTop: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  buttonText: { color: colors.accent, fontSize: 14, fontWeight: '800' },
  note: { color: colors.muted, textAlign: 'center', fontSize: 13, marginTop: 12 },
  pressed: { opacity: 0.75 },
  disabled: { opacity: 0.45 },
});
