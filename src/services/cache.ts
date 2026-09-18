import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'khetha_cache_';

// Network-first: try the live request, and on success write the result to
// AsyncStorage for next time. Only falls back to the cached copy if the
// network call itself fails (offline, dead tunnel, etc.) — never silently
// prefers stale data over a working connection.
export async function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cacheKey = CACHE_PREFIX + key;
  try {
    const data = await fetcher();
    AsyncStorage.setItem(cacheKey, JSON.stringify(data)).catch(() => {});
    return data;
  } catch (error) {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached !== null) return JSON.parse(cached) as T;
    throw error;
  }
}
