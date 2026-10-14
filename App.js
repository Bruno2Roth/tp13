import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GameProvider, useGame } from './src/context/GameContext';
import GameScreen from './src/screens/GameScreen';
import HomeScreen from './src/screens/HomeScreen';
import RankingScreen from './src/screens/RankingScreen';

function AppContent() {
  const { screen } = useGame();
  return (
    <SafeAreaView style={styles.safeArea}>
      {screen === 'game' ? <GameScreen /> : screen === 'ranking' ? <RankingScreen /> : <HomeScreen />}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B1220' },
});
