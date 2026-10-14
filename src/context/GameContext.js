import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCountries, normalizeCountryName } from '../services/countriesApi';

const { chooseCountry, buildCapitalOptions, pointsForCorrectAnswer } = require('../utils/gameRules');
const RANKING_STORAGE_KEY = '@adivina-el-pais/ranking';

export const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(null);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [ranking, setRanking] = useState([]);
  const [mode, setMode] = useState('flags');
  const [timer, setTimer] = useState(15);
  const [hintIndexes, setHintIndexes] = useState([]);
  const [capitalOptions, setCapitalOptions] = useState([]);
  const [eliminatedCapitalOptions, setEliminatedCapitalOptions] = useState([]);
  const [guessText, setGuessText] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [screen, setScreen] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiNotice, setApiNotice] = useState('');
  const transitionTimeout = useRef(null);
  const feedbackTimeout = useRef(null);

  const loadCountries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchCountries();
      setCountries(result);
      setCurrentCountry((previousCountry) => previousCountry || chooseCountry(result, 'flags', null));
      if (!result.some((country) => country.capital)) {
        setApiNotice('No llegaron capitales desde la API. El modo banderas sigue disponible.');
      } else {
        setApiNotice('');
      }
    } catch (loadError) {
      setError(loadError.message || 'No se pudieron cargar los países.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadSavedRanking = async () => {
      try {
        const storedRanking = await AsyncStorage.getItem(RANKING_STORAGE_KEY);
        if (mounted && storedRanking) {
          const parsed = JSON.parse(storedRanking);
          if (Array.isArray(parsed)) setRanking(parsed);
        }
      } catch (storageError) {
        console.warn('No se pudo leer el ranking guardado.', storageError);
      }
    };

    loadCountries();
    loadSavedRanking();

    return () => {
      mounted = false;
      clearTimeout(transitionTimeout.current);
      clearTimeout(feedbackTimeout.current);
    };
  }, [loadCountries]);

  const resetRound = useCallback((country) => {
    setCurrentCountry(country);
    setTimer(15);
    setHintIndexes([]);
    setCapitalOptions(buildCapitalOptions(countries, country));
    setEliminatedCapitalOptions([]);
    setGuessText('');
    setFeedback(null);
  }, [countries]);

  const nextCountry = useCallback(() => {
    const next = chooseCountry(countries, mode, currentCountry?.id);
    if (!next) {
      setError(mode === 'capitals'
        ? 'No hay países con capital disponible para jugar este modo.'
        : 'Todavía no hay países para jugar.');
      return;
    }
    resetRound(next);
  }, [countries, currentCountry, mode, resetRound]);

  const startGame = useCallback((selectedMode) => {
    const cleanName = playerName.trim();
    if (!cleanName) {
      setError('Escribí tu nombre para empezar.');
      return;
    }
    if (loading) return;

    const firstCountry = selectedMode === 'flags' && currentCountry
      ? currentCountry
      : chooseCountry(countries, selectedMode, null);
    if (!firstCountry) {
      setError(selectedMode === 'capitals'
        ? 'El modo capitales no tiene datos disponibles ahora.'
        : 'No hay países disponibles. Volvé a cargar los datos.');
      return;
    }

    clearTimeout(transitionTimeout.current);
    clearTimeout(feedbackTimeout.current);
    setPlayerName(cleanName);
    setMode(selectedMode);
    setScore(0);
    setError('');
    setScreen('game');
    resetRound(firstCountry);
  }, [countries, currentCountry, loading, playerName, resetRound]);

  const submitGuess = useCallback((answer = guessText) => {
    if (screen !== 'game' || !currentCountry || timer <= 0 || feedback?.type === 'correct') return;

    const expected = mode === 'capitals' ? currentCountry.capital : currentCountry.name;
    if (normalizeCountryName(answer) === normalizeCountryName(expected)) {
      const points = pointsForCorrectAnswer(timer);
      setScore((previousScore) => previousScore + points);
      setFeedback({ type: 'correct', message: `¡Correcto! Sumaste ${points} puntos.` });
      clearTimeout(transitionTimeout.current);
      transitionTimeout.current = setTimeout(() => {
        const next = chooseCountry(countries, mode, currentCountry.id);
        if (next) resetRound(next);
      }, 900);
      return;
    }

    setScore((previousScore) => previousScore - 1);
    setFeedback({ type: 'wrong', message: 'No es esa. Probá otra vez: perdiste 1 punto.' });
    clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 900);
  }, [countries, currentCountry, feedback, guessText, mode, resetRound, screen, timer]);

  const requestHint = useCallback(() => {
    if (mode !== 'flags' || !currentCountry || timer <= 2 || feedback?.type === 'correct') return;
    const hiddenIndexes = currentCountry.name
      .split('')
      .map((letter, index) => (letter !== ' ' && !hintIndexes.includes(index) ? index : -1))
      .filter((index) => index >= 0);
    if (!hiddenIndexes.length) return;

    const selectedIndex = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
    setHintIndexes((previousIndexes) => [...previousIndexes, selectedIndex]);
    setTimer((previousTimer) => Math.max(0, previousTimer - 2));
    setFeedback({ type: 'hint', message: 'Pista usada: se descontaron 2 segundos.' });
    clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 900);
  }, [currentCountry, feedback, hintIndexes, mode, timer]);

  useEffect(() => {
    if (screen !== 'game' || timer <= 0 || feedback?.type === 'correct' || feedback?.type === 'timeout') return undefined;
    const tick = setTimeout(() => setTimer((previousTimer) => Math.max(0, previousTimer - 1)), 1000);
    return () => clearTimeout(tick);
  }, [feedback, screen, timer]);

  useEffect(() => {
    if (screen !== 'game' || mode !== 'capitals' || !currentCountry || timer <= 0 || timer === 15 || timer % 5 !== 0) return;
    const remainingWrongOptions = capitalOptions.filter((option) => (
      normalizeCountryName(option) !== normalizeCountryName(currentCountry.capital)
      && !eliminatedCapitalOptions.includes(option)
    ));
    if (!remainingWrongOptions.length) return;
    const optionToRemove = remainingWrongOptions[Math.floor(Math.random() * remainingWrongOptions.length)];
    setEliminatedCapitalOptions((previousOptions) => [...previousOptions, optionToRemove]);
    setFeedback({ type: 'hint', message: 'Se eliminó una opción incorrecta.' });
    clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => setFeedback(null), 700);
  }, [capitalOptions, currentCountry, eliminatedCapitalOptions, mode, screen, timer]);

  useEffect(() => {
    if (screen !== 'game' || timer !== 0 || !currentCountry || feedback) return;
    const correctAnswer = mode === 'capitals' ? currentCountry.capital : currentCountry.name;
    setFeedback({ type: 'timeout', message: `Se terminó el tiempo. La respuesta era ${correctAnswer}.` });
  }, [currentCountry, feedback, mode, screen, timer]);

  useEffect(() => {
    if (screen !== 'game' || feedback?.type !== 'timeout') return undefined;
    const transition = setTimeout(() => nextCountry(), 1400);
    return () => clearTimeout(transition);
  }, [feedback, nextCountry, screen]);

  const finishGame = useCallback(async () => {
    clearTimeout(transitionTimeout.current);
    clearTimeout(feedbackTimeout.current);
    const result = {
      id: `${Date.now()}`,
      name: playerName.trim() || 'Jugador',
      score,
      date: new Date().toISOString(),
    };
    const updatedRanking = [...ranking, result]
      .sort((first, second) => second.score - first.score || first.date.localeCompare(second.date))
      .slice(0, 10);
    setRanking(updatedRanking);
    setScreen('ranking');
    setFeedback(null);
    try {
      await AsyncStorage.setItem(RANKING_STORAGE_KEY, JSON.stringify(updatedRanking));
    } catch (storageError) {
      setError('No se pudo guardar el ranking en este dispositivo.');
      console.warn('No se pudo guardar el ranking.', storageError);
    }
  }, [playerName, ranking, score]);

  const openRanking = useCallback(() => {
    setError('');
    setScreen('ranking');
  }, []);

  const returnHome = useCallback(() => {
    clearTimeout(transitionTimeout.current);
    clearTimeout(feedbackTimeout.current);
    setFeedback(null);
    setError('');
    setScreen('home');
  }, []);

  const hintText = currentCountry
    ? currentCountry.name.split('').map((letter, index) => (
      letter === ' ' || hintIndexes.includes(index) ? letter : '•'
    )).join(' ')
    : '';

  const value = useMemo(() => ({
    countries,
    currentCountry,
    score,
    playerName,
    setPlayerName,
    ranking,
    mode,
    timer,
    hintIndexes,
    hintText,
    capitalOptions,
    eliminatedCapitalOptions,
    guessText,
    setGuessText,
    feedback,
    screen,
    loading,
    error,
    apiNotice,
    loadCountries,
    startGame,
    submitGuess,
    requestHint,
    nextCountry,
    finishGame,
    openRanking,
    returnHome,
  }), [
    apiNotice,
    capitalOptions,
    countries,
    currentCountry,
    eliminatedCapitalOptions,
    error,
    feedback,
    finishGame,
    guessText,
    hintIndexes,
    hintText,
    loadCountries,
    loading,
    mode,
    nextCountry,
    openRanking,
    playerName,
    ranking,
    requestHint,
    returnHome,
    screen,
    score,
    startGame,
    submitGuess,
    timer,
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de GameProvider.');
  return context;
}
