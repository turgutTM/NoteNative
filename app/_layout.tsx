import "react-native-reanimated";
import { Stack } from "expo-router";
import GlobalProvider from "../context/GlobalProvider";

export default function RootLayout() {
  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(pages)" options={{ headerShown: false }} />
        <Stack.Screen name="noteDetail" options={{ headerShown: false }} />
      </Stack>
    </GlobalProvider>
  );
}
