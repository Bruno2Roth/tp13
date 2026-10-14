const FLAGS_URL = 'https://countriesnow.space/api/v0.1/countries/flag/images';
const CAPITALS_URL = 'https://countriesnow.space/api/v0.1/countries/capital';

export function normalizeCountryName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

async function fetchList(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`La API respondió con el estado ${response.status}.`);
  }

  const result = await response.json();
  if (result.error) {
    throw new Error(result.msg || 'La API no pudo devolver los datos.');
  }
  return Array.isArray(result.data) ? result.data : [];
}

export async function fetchCountries() {
  const [flagResult, capitalResult] = await Promise.allSettled([
    fetchList(FLAGS_URL),
    fetchList(CAPITALS_URL),
  ]);

  if (flagResult.status === 'rejected') {
    throw new Error('No se pudieron cargar las banderas. Revisá tu conexión e intentá de nuevo.');
  }

  const capitalByCountry = new Map();
  if (capitalResult.status === 'fulfilled') {
    capitalResult.value.forEach((item) => {
      const countryName = item.name || item.country || '';
      const capital = item.capital || item.capitalCity || '';
      const key = normalizeCountryName(countryName);
      if (key && capital) capitalByCountry.set(key, String(capital).trim());
    });
  }

  return flagResult.value
    .map((item) => {
      const name = String(item.name || item.country || '').trim();
      const flag = String(item.flag || item.image || '').trim();
      const key = normalizeCountryName(name);
      return {
        id: key,
        name,
        flag,
        capital: capitalByCountry.get(key) || '',
      };
    })
    .filter((country) => country.id && country.name && country.flag);
}

export { FLAGS_URL, CAPITALS_URL };
