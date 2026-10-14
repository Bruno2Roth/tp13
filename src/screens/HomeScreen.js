import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

export default function HomeScreen() {
  const {
    playerName,
    setPlayerName,
    countries,
    loading,
    error,
    apiNotice,
    loadCountries,
    startGame,
    openRanking,
  } = useGame();

  const capitalsAvailable = countries.some((country) => country.capital);

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.hero}>
        <View style={styles.globe}>
          <Text style={styles.globeText}>MAPA</Text>
        </View>
        <Text style={styles.kicker}>JUEGO DE GEOGRAFÍA</Text>
        <Text style={styles.title}>Adivina{ '\n' }el País</Text>
        <Text style={styles.description}>Reconocé banderas, descubrí capitales y sumá puntos antes de que termine el tiempo.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>¿CÓMO TE LLAMÁS?</Text>
        <TextInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Tu nombre"
          placeholderTextColor={colors.muted}
          autoCapitalize="words"
          maxLength={24}
          accessibilityLabel="Nombre del jugador"
          style={styles.input}
        />
        <Text style={styles.label}>ELEGÍ UN MODO</Text>

        <Pressable
          accessibilityRole="button"
          onPress={() => startGame('flags')}
          disabled={loading || !countries.length}
          style={({ pressed }) => [styles.modeButton, pressed && styles.pressed, (loading || !countries.length) && styles.disabled]}
        >
          <View style={styles.modeCopy}>
            <Text style={styles.modeTitle}>Adivinar banderas</Text>
            <Text style={styles.modeText}>Escribí el nombre del país.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => startGame('capitals')}
          disabled={loading || !capitalsAvailable}
          style={({ pressed }) => [styles.modeButton, pressed && styles.pressed, (loading || !capitalsAvailable) && styles.disabled]}
        >
          <View style={styles.modeCopy}>
            <Text style={styles.modeTitle}>Adivinar capitales</Text>
            <Text style={styles.modeText}>Elegí entre tres respuestas.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Text style={styles.status}>{loading ? 'Cargando países...' : `${countries.length} países disponibles`}</Text>
        {apiNotice ? <Text style={styles.notice}>{apiNotice}</Text> : null}
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadCountries} accessibilityRole="button">
              <Text style={styles.retry}>Volver a intentar</Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      <Pressable accessibilityRole="button" onPress={openRanking} style={styles.rankingButton}>
        <Text style={styles.rankingText}>Ver ranking</Text>
      </Pressable>
      <Text style={styles.footer}>Conocé el mundo, una bandera a la vez.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: colors.background, paddingHorizontal: 22, paddingTop: 28, paddingBottom: 32 },
  hero: { alignItems: 'center', marginBottom: 24 },
  globe: { width: 56, height: 56, borderRadius: 18, borderWidth: 1, borderColor: '#5B6476', backgroundColor: colors.panel, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  globeText: { color: colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  kicker: { color: colors.accent, fontSize: 11, fontWeight: '900', letterSpacing: 2.2 },
  title: { color: colors.text, fontSize: 42, lineHeight: 45, fontWeight: '900', textAlign: 'center', marginTop: 8 },
  description: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 330, marginTop: 12 },
  card: { backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18 },
  label: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.2, marginBottom: 8, marginTop: 4 },
  input: { height: 50, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, color: colors.text, fontSize: 16, marginBottom: 18 },
  modeButton: { minHeight: 70, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.panelLight, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 15, marginTop: 9 },
  modeCopy: { flex: 1 },
  modeTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  modeText: { color: colors.muted, fontSize: 12, marginTop: 4 },
  arrow: { color: colors.accent, fontSize: 30, fontWeight: '300', marginLeft: 12 },
  status: { color: colors.muted, textAlign: 'center', fontSize: 12, marginTop: 14 },
  notice: { color: colors.accent, fontSize: 12, lineHeight: 17, textAlign: 'center', marginTop: 8 },
  errorBox: { borderWidth: 1, borderColor: colors.danger, backgroundColor: '#3B242C', borderRadius: 12, padding: 12, marginTop: 12 },
  errorText: { color: colors.text, fontSize: 13, textAlign: 'center', lineHeight: 18 },
  retry: { color: colors.accent, fontSize: 13, fontWeight: '800', textAlign: 'center', marginTop: 8 },
  rankingButton: { alignItems: 'center', padding: 14, marginTop: 12 },
  rankingText: { color: colors.text, fontSize: 14, fontWeight: '800' },
  footer: { color: '#75839A', fontSize: 11, textAlign: 'center', marginTop: 10 },
  pressed: { opacity: 0.76 },
  disabled: { opacity: 0.42 },
});
