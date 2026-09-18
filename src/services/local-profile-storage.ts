import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_LOCAL_PROFILE, LocalProfile } from '@/data/local-profile';

const KEY = 'khetha_local_profile';

export const LocalProfileStorage = {
  async get(): Promise<LocalProfile> {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? { ...DEFAULT_LOCAL_PROFILE, ...JSON.parse(raw) } : DEFAULT_LOCAL_PROFILE;
  },
  async update(patch: Partial<LocalProfile>): Promise<LocalProfile> {
    const current = await LocalProfileStorage.get();
    const next = { ...current, ...patch };
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    return next;
  },
};
