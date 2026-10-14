function normalizeCountryName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function chooseCountry(countries, mode, currentId, random = Math.random) {
  const playable = countries.filter((country) => (
    mode === 'capitals' ? Boolean(country.capital) : Boolean(country.flag)
  ));
  const withoutCurrent = playable.filter((country) => country.id !== currentId);
  const choices = withoutCurrent.length ? withoutCurrent : playable;
  if (!choices.length) return null;
  return choices[Math.floor(random() * choices.length)];
}

function buildCapitalOptions(countries, target, random = Math.random) {
  if (!target || !target.capital) return [];

  const uniqueCapitals = [...new Set(
    countries
      .map((country) => country.capital)
      .filter(Boolean)
      .map((capital) => String(capital).trim())
      .filter((capital) => capital && normalizeCountryName(capital) !== normalizeCountryName(target.capital))
  )];

  for (let index = uniqueCapitals.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [uniqueCapitals[index], uniqueCapitals[swapIndex]] = [uniqueCapitals[swapIndex], uniqueCapitals[index]];
  }

  return [target.capital, ...uniqueCapitals.slice(0, 2)].sort(() => random() - 0.5);
}

function pointsForCorrectAnswer(secondsLeft) {
  return 10 + Math.max(0, Math.floor(Number(secondsLeft) || 0));
}

module.exports = { chooseCountry, buildCapitalOptions, pointsForCorrectAnswer };
