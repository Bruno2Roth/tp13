import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, StyleSheet, Text, View } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';
import { useGame } from '../context/GameContext';
import { colors } from '../theme';

function fixSvgViewBox(svgText) {
  if (!svgText || typeof svgText !== 'string') return svgText;

  if (/viewBox=/i.test(svgText)) {
    return svgText;
  }

  const svgTagMatch = svgText.match(/<svg\b([^>]*)>/i);
  if (!svgTagMatch) return svgText;

  const svgTagAttrs = svgTagMatch[1];
  const widthMatch = svgTagAttrs.match(/\bwidth=["']([0-9.]+)(?:px)?["']/i);
  const heightMatch = svgTagAttrs.match(/\bheight=["']([0-9.]+)(?:px)?["']/i);

  if (widthMatch && heightMatch) {
    const width = widthMatch[1];
    const height = heightMatch[1];
    return svgText.replace(
      /<svg\b([^>]*)>/i,
      `<svg$1 viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`
    );
  }

  return svgText;
}

function NativeSvgFlag({ uri }) {
  const [xml, setXml] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);
    setXml(null);

    fetch(uri)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((rawXml) => {
        if (!isMounted) return;
        const fixed = fixSvgViewBox(rawXml);
        setXml(fixed);
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (error || !xml) {
    return (
      <SvgUri
        uri={uri}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        accessibilityLabel="Bandera del país que hay que adivinar"
      />
    );
  }

  if (loading) {
    return <ActivityIndicator size="small" color={colors.accent} />;
  }

  return (
    <SvgXml
      xml={xml}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      accessibilityLabel="Bandera del país que hay que adivinar"
    />
  );
}

function FlagImage({ uri }) {
  if (!uri) return null;

  const isSvg = uri.toLowerCase().includes('.svg');

  // On Web, native <img> scales SVGs cleanly using object-fit: contain without any clipping
  if (Platform.OS === 'web' || !isSvg) {
    return (
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
        accessibilityLabel="Bandera del país que hay que adivinar"
      />
    );
  }

  return <NativeSvgFlag uri={uri} />;
}

export default function Flag() {
  const { currentCountry, hintText, mode } = useGame();

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{mode === 'capitals' ? 'PAÍS' : '¿DE QUÉ PAÍS ES?'}</Text>
      <View style={styles.card}>
        {currentCountry?.flag ? (
          <View style={styles.flagContainer}>
            <FlagImage uri={currentCountry.flag} />
          </View>
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
    width: '100%',
    maxWidth: 440,
    aspectRatio: 1.6,
    borderRadius: 18,
    backgroundColor: colors.white,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  flagContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loading: { color: colors.background, fontSize: 16, fontWeight: '700' },
  prompt: { color: colors.text, fontSize: 19, fontWeight: '700', marginTop: 16 },
  hint: { color: colors.accent, fontSize: 16, fontWeight: '700', letterSpacing: 1.3, marginTop: 16, minHeight: 22 },
});
