import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { saveData, removeData } from "../services/StorageService";

export default function ConfiguracoesScreen() {
  const limparPedidos = async () => {
    Alert.alert(
      "Confirmar Ação",
      "Tem certeza que deseja limpar todos os pedidos e reiniciar o contador?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          onPress: async () => {
            await removeData("pedidos");
            Alert.alert(
              "Sucesso",
              "Todos os pedidos foram removidos e o contador foi reiniciado."
            );
          },
        },
      ]
    );
  };

  const limparItens = async () => {
    Alert.alert(
      "Confirmar Ação",
      "Tem certeza que deseja limpar todos os itens cadastrados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          onPress: async () => {
            await removeData("itens");
            Alert.alert("Sucesso", "Todos os itens foram removidos.");
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Configurações</Text>
      <Button
        title="Limpar Todos os Pedidos"
        onPress={limparPedidos}
        color="red"
      />
      <Button
        title="Limpar Todos os Itens"
        onPress={limparItens}
        color="orange"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}