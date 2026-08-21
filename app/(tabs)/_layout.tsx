
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import Fontisto from '@expo/vector-icons/Fontisto';

export default function TabLayout() {
  return (
  <Tabs
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
  
      tabBarActiveTintColor: "#2563EB",
      tabBarInactiveTintColor: "#94A3B8",
  
      tabBarStyle: {
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E2E8F0",
      },
    }}
  >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{
                  ios: "magnifyingglass",
                  android: "search",
                  web: "search",
                }}
                tintColor={color}
                size={26}
              />
            ),
          }}
        />
  
        <Tabs.Screen
          name="partRegister"
          options={{
            tabBarIcon: ({ color }) => (
              <SymbolView
                name={{
                  ios: "camera.fill",
                  android: "camera",
                  web: "camera",
                }}
                tintColor={color}
                size={26}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="verticalization"
          options={{
            tabBarIcon: ({ color }) => (
              <Fontisto name="line-chart" size={20} color={color} />
            ),
          }}
        />
      </Tabs>
  );
}