import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = 'khetha_onboarding_complete';

export const OnboardingStorage = {
  async isComplete(): Promise<boolean> {
    return (await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)) === 'true';
  },
  async setComplete(): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  },
};
