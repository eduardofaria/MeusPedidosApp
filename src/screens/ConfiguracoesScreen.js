import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, Switch, StyleSheet } from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { saveData, getData, removeData } from "../services/StorageService";

export default function ConfiguracoesScreen() {
  const [notificar, setNotificar] = useState(false);
  const [codigoPais, setCodigoPais] = useState("+55"); // Brasil como padrão

  // Carrega o estado atual da configuração
  useEffect(() => {
    const fetchConfig = async () => {
      const storedNotificar = await getData("notificar");
      const storedCodigoPais = (await getData("codigoPais")) || "+55"; // Carrega o código do país, Brasil como padrão
      setNotificar(storedNotificar || false);
      setCodigoPais(storedCodigoPais);
    };
    fetchConfig();
  }, []);

  const toggleNotificar = async () => {
    const novoValor = !notificar;
    setNotificar(novoValor);
    await saveData("notificar", novoValor);
  };

  const salvarCodigoPais = async (novoCodigo) => {
    setCodigoPais(novoCodigo);
    await saveData("codigoPais", novoCodigo);
  };

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
    <View style={styles.container}>
      <Text style={styles.headerText}>Configurações</Text>

      {/* Opção de Notificação Automática */}
      <View style={styles.switchContainer}>
        <Text>Notificar Cliente ao Criar/Concluir Pedido</Text>
        <Switch value={notificar} onValueChange={toggleNotificar} />
      </View>

      {/* Campo para configurar o código do país */}
      <Text style={styles.label}>Código do País</Text>
      <MaskedTextInput
        mask="+999"
        keyboardType="numeric"
        value={codigoPais}
        onChangeText={salvarCodigoPais}
        style={styles.input}
      />

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
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
