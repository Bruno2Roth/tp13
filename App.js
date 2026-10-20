import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B1220' },
});
