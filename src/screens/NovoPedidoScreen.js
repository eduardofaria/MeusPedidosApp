import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import { saveData, getData } from "../services/StorageService";

export default function NovoPedidoScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [itensDisponiveis, setItensDisponiveis] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);

  useEffect(() => {
    const fetchItens = async () => {
      const storedItens = await getData("itens");
      setItensDisponiveis(storedItens || []); // sempre fornece um array
    };
    fetchItens();
  }, []);

  const selecionarItem = (item) => {
    const itemDuplicado = { ...item, uniqueId: Date.now().toString() };
    setItensSelecionados([...itensSelecionados, itemDuplicado]);
  };

  const removerItemSelecionado = (uniqueId) => {
    setItensSelecionados(
      itensSelecionados.filter((item) => item.uniqueId !== uniqueId)
    );
  };

  const adicionarPedido = async () => {
    if (telefone && telefone.replace(/[^0-9]/g, "").length < 11) {
      Alert.alert("Erro", "O telefone deve ter o formato (XX) XXXXX-XXXX.");
      return;
    }

    const pedidosExistentes = (await getData("pedidos")) || [];
    const numeroPedido = (pedidosExistentes.length % 999) + 1;
    const novoPedido = {
      id: Date.now(),
      numero: numeroPedido.toString().padStart(3, "0"),
      nome: nome || "Cliente Anônimo",
      telefone,
      itens: itensSelecionados,
      status: "Pendente",
    };

    await saveData("pedidos", [...pedidosExistentes, novoPedido]);

    Alert.alert("Sucesso", `Pedido #${numeroPedido} adicionado.`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cliente</Text>
      <TextInput
        placeholder="Nome do Cliente"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <Text style={styles.label}>Telefone</Text>
      <MaskedTextInput
        mask="(99) 99999-9999"
        placeholder="Telefone"
        keyboardType="numeric"
        value={telefone}
        onChangeText={(text) => setTelefone(text)}
        style={styles.input}
      />

      <Text style={styles.label}>Itens Disponíveis</Text>
      <View style={styles.itensContainer}>
        {itensDisponiveis.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemButton}
            onPress={() => selecionarItem(item)}
          >
            <Text style={styles.itemButtonText}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Itens Selecionados</Text>
      <FlatList
        data={itensSelecionados}
        keyExtractor={(item) => item.uniqueId}
        renderItem={({ item }) => (
          <View style={styles.itemSelecionadoContainer}>
            <Text style={styles.itemSelecionadoText}>
              {item.nome} - R${item.preco}
            </Text>
            <TouchableOpacity
              onPress={() => removerItemSelecionado(item.uniqueId)}
            >
              <Text style={styles.excluirButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Adicionar Pedido" onPress={adicionarPedido} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  itensContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  itemButton: {
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5,
    padding: 5,
    margin: 5,
    backgroundColor: "#f0f8ff",
  },
  itemButtonText: {
    color: "blue",
    fontSize: 14,
  },
  itemSelecionadoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    height: 50,
  },
  itemSelecionadoText: {
    fontSize: 16,
  },
  excluirButtonText: {
    color: "red",
    fontWeight: "bold",
  },
});
