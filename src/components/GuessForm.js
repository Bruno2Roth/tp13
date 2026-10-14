import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function GuessForm() {
  const {
    mode,
    guessText,
    setGuessText,
    submitGuess,
    timer,
    feedback,
    capitalOptions,
    eliminatedCapitalOptions,
  } = useGame();

  if (mode === 'capitals') {
    const visibleOptions = capitalOptions.filter((option) => !eliminatedCapitalOptions.includes(option));
    return (
      <View style={styles.options}>
        <Text style={styles.label}>ELEGÍ UNA OPCIÓN</Text>
        {visibleOptions.map((option) => (
          <Pressable
            key={option}
            accessibilityRole="button"
            onPress={() => submitGuess(option)}
            disabled={timer <= 0 || feedback?.type === 'correct'}
            style={({ pressed }) => [styles.option, pressed && styles.pressed, timer <= 0 && styles.disabled]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>TU RESPUESTA</Text>
      <TextInput
        value={guessText}
        onChangeText={setGuessText}
        onSubmitEditing={() => submitGuess()}
        placeholder="Escribí el país"
        placeholderTextColor={colors.muted}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="send"
        editable={timer > 0 && feedback?.type !== 'correct'}
        accessibilityLabel="Nombre del país"
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => submitGuess()}
        disabled={!guessText.trim() || timer <= 0 || feedback?.type === 'correct'}
        style={({ pressed }) => [styles.submit, pressed && styles.pressed, (!guessText.trim() || timer <= 0) && styles.disabled]}
      >
        <Text style={styles.submitText}>Responder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%', marginTop: 16 },
  label: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.1, marginBottom: 8 },
  input: {
    height: 52, borderRadius: 13, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.panel, color: colors.text, paddingHorizontal: 16, fontSize: 16,
  },
  submit: { minHeight: 50, borderRadius: 13, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  submitText: { color: colors.background, fontSize: 16, fontWeight: '900' },
  options: { width: '100%', marginTop: 18 },
  option: { minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.panel, justifyContent: 'center', paddingHorizontal: 16, marginBottom: 9 },
  optionText: { color: colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
});
