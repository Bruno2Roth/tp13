import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function Flag() {
  const { currentCountry, hintText, mode } = useGame();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{mode === 'capitals' ? 'PAÍS' : '¿DE QUÉ PAÍS ES?'}</Text>
      <View style={styles.card}>
        {currentCountry?.flag ? (
          currentCountry.flag.toLowerCase().includes('.svg') ? (
            <SvgUri
              uri={currentCountry.flag}
              width="100%"
              height="100%"
              accessibilityLabel="Bandera del país que hay que adivinar"
            />
          ) : (
            <Image
              source={{ uri: currentCountry.flag }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel="Bandera del país que hay que adivinar"
            />
          )
        ) : (
          <Text style={styles.loading}>Cargando bandera...</Text>
        )}
      </View>
      {mode === 'capitals' ? (
        <Text style={styles.prompt}>¿Cuál es su capital?</Text>
      ) : (
        <Text style={styles.hint}>{hintText || 'Usá una pista si necesitás ayuda'}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', alignItems: 'center', marginTop: 8 },
  label: { color: colors.muted, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  card: {
    width: '100%', height: 190, borderRadius: 22, backgroundColor: colors.white,
    padding: 18, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  loading: { color: colors.background, fontSize: 16, fontWeight: '700' },
  prompt: { color: colors.text, fontSize: 19, fontWeight: '700', marginTop: 16 },
  hint: { color: colors.accent, fontSize: 16, fontWeight: '700', letterSpacing: 1.3, marginTop: 16, minHeight: 22 },
});
