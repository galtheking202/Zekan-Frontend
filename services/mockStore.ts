import AsyncStorage from '@react-native-async-storage/async-storage';

const MOCK_MODE_KEY = '@zekan/mock_mode';

let _enabled = false;
let _initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!_initPromise) {
    _initPromise = AsyncStorage.getItem(MOCK_MODE_KEY).then((v) => {
      _enabled = v === 'true';
    });
  }
  return _initPromise;
}

export async function isMockEnabled(): Promise<boolean> {
  await ensureInit();
  return _enabled;
}

export async function setMockEnabled(enabled: boolean): Promise<void> {
  await ensureInit();
  _enabled = enabled;
  await AsyncStorage.setItem(MOCK_MODE_KEY, String(enabled));
}
