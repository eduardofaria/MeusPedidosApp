import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/screens/HomeScreen";
import NovoPedidoScreen from "./src/screens/NovoPedidoScreen";
import ItensScreen from "./src/screens/ItensScreen";
import ConfiguracoesScreen from "./src/screens/ConfiguracoesScreen";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Pedidos Ativos" }}
        />
        <Stack.Screen
          name="NovoPedido"
          component={NovoPedidoScreen}
          options={{ title: "Novo Pedido" }}
        />
        <Stack.Screen
          name="Itens"
          component={ItensScreen}
          options={{ title: "Gerenciar Itens" }}
        />
        <Stack.Screen
          name="Configuracoes"
          component={ConfiguracoesScreen}
          options={{ title: "Configurações" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
