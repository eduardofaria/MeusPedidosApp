import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Switch, StyleSheet } from "react-native";
import { saveData, getData, removeData } from "../services/StorageService";

export default function ConfiguracoesScreen() {
  const [notificar, setNotificar] = useState(false);

  // Carrega o estado atual da configuração de notificação
  useEffect(() => {
    const fetchConfig = async () => {
      const storedNotificar = await getData("notificar");
      setNotificar(storedNotificar || false);
    };
    fetchConfig();
  }, []);

  // Alterna o estado de notificação e salva a nova configuração
  const toggleNotificar = async () => {
    const novoValor = !notificar;
    setNotificar(novoValor);
    await saveData("notificar", novoValor);
  };

  // Função para limpar todos os pedidos e reiniciar o contador
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

  // Função para limpar todos os itens
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
    <View style={styles.container}>
      <Text style={styles.headerText}>Configurações</Text>

      {/* Opção de Notificação Automática */}
      <View style={styles.switchContainer}>
        <Text>Notificar Cliente ao Criar/Concluir Pedido</Text>
        <Switch value={notificar} onValueChange={toggleNotificar} />
      </View>

      {/* Botões de Limpeza */}
      <Button
        title="Limpar Todos os Pedidos"
        onPress={limparPedidos}
        color="red"
      />
      <Button
        title="Limpar Todos os Itens"
        onPress={limparItens}
        color="orange"
        style={styles.buttonSpacing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
