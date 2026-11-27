import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { fonts } from '@/ui/fonts';
import { useTheme } from '@/ui/use-theme';

export default function RootLayout() {
  const { scheme, colors } = useTheme();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.accentText,
          background: colors.paper,
          card: colors.paper,
          text: colors.ink,
          border: colors.outline,
          notification: colors.accent,
        },
      }}
    >
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.paper },
          headerShadowVisible: false,
          headerTintColor: colors.accentText,
          headerTitleStyle: { fontFamily: fonts.hand, color: colors.ink },
          headerBackTitle: 'Wstecz',
          headerBackButtonDisplayMode: 'default',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="showcase" options={{ title: 'Wzornik' }} />
        <Stack.Screen name="lesson/[id]" options={{ title: '' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
