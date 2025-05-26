// Crie este arquivo em: app/_layout.jsx
import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index" // O nome do seu arquivo de tela (index.js ou index.jsx)
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
