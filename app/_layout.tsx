import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { initDatabase } from '@/services/database';
import { ActivityIndicator, View } from 'react-native';

import Toast from "react-native-toast-message";
import Header from '@/components/Header';
import HeaderProvider from '@/contexts/HeaderContext';
import SettingsProvider from '@/contexts/SettingsContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#0f172a',
    text: '#f8fafc',
    border: '#334155',
    primary: '#2563eb',
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
       initDatabase()
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (error) {
      console.error('Font loading failed:', error);
      SplashScreen.hideAsync();
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded && !error) {
    return null;
  }

  if(loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return <RootLayoutNav />;
}


function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? AppDarkTheme : DefaultTheme}>
      <SettingsProvider>
        <HeaderProvider>
          <Header />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: '#0f172a' },
              headerTintColor: '#f8fafc',
              contentStyle: { backgroundColor: '#0f172a' },
            }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="dataset-capture"
              options={{
                title: 'Captura automática',
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen
              name="search"
              options={{
                title: 'Buscar peça',
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen
              name="result"
              options={{
                title: 'Resultado',
                headerBackTitle: 'Voltar',
              }}
            />
          </Stack>
          <Toast />
        </HeaderProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
