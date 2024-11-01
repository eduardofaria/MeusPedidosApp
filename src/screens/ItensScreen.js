import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { saveData, getData } from "../services/StorageService";

export default function ItensScreen({ navigation }) {
  const [itens, setItens] = useState([]);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    const fetchItens = async () => {
      const storedItens = await getData("itens");
      setItens(storedItens || []); // verifica array
    };
    fetchItens();
  }, []);

  const adicionarItem = async () => {
    if (!nome || !preco) {
      Alert.alert("Erro", "Nome e preço do item são obrigatórios.");
      return;
    }

    const novoItem = { id: Date.now().toString(), nome, preco };
    const novosItens = [...itens, novoItem];
    setItens(novosItens);
    await saveData("itens", novosItens);

    setNome("");
    setPreco("");
  };

  const removerItem = async (id) => {
    const pedidosAtivos = await getData("pedidos");
    const itemEmUso =
      pedidosAtivos &&
      pedidosAtivos.some((pedido) =>
        pedido.itens.some((item) => item.id === id)
      );

    if (itemEmUso) {
      Alert.alert(
        "Erro",
        "Este item está em uso em um pedido ativo e não pode ser removido."
      );
      return;
    }

    const novosItens = itens.filter((item) => item.id !== id);
    setItens(novosItens);
    await saveData("itens", novosItens);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Adicionar Novo Item</Text>
      <TextInput
        placeholder="Nome do Item"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="Preço do Item"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />
      <Button title="Adicionar Item" onPress={adicionarItem} />

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              backgroundColor: "#f9f9f9",
              marginVertical: 5,
            }}
          >
            <Text>
              {item.nome} - R${item.preco}
            </Text>
            <TouchableOpacity onPress={() => removerItem(item.id)}>
              <Text style={{ color: "red" }}>Remover</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
