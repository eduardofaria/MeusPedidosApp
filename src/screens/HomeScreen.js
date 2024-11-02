import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { saveData, getData, removeData } from "../services/StorageService";
import { useIsFocused } from "@react-navigation/native";
import { solicitarCompartilhamento } from "../services/ShareService";

export default function HomeScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [notificar, setNotificar] = useState(false);
  const isFocused = useIsFocused(); // Detecta o foco na tela

  const fetchPedidos = async () => {
    const storedPedidos = await getData("pedidos");
    const storedNotificar = await getData("notificar"); // Carrega configuração de notificação
    setNotificar(storedNotificar || false); // Define se notificações estão ativadas
    setPedidos((storedPedidos || []).reverse()); // Exibe pedidos mais recentes primeiro
  };

  useEffect(() => {
    if (isFocused) {
      fetchPedidos();
    }
  }, [isFocused]);

  const handleConcluir = async (id) => {
    const updatedPedidos = pedidos.map((p) =>
      p.id === id ? { ...p, status: "Concluído" } : p
    );
    setPedidos(updatedPedidos);
    await saveData("pedidos", updatedPedidos);

    const pedido = updatedPedidos.find((p) => p.id === id);

    // Verifica se a notificação está ativada e se o telefone está preenchido
    if (notificar && pedido.telefone) {
      solicitarCompartilhamento(
        pedido,
        "Seu pedido foi concluído e aguarda retirada:"
      );
    }
  };

  const concluirPedido = async (id) => {
    Alert.alert(
      "Confirmar Conclusão",
      "Deseja marcar este pedido como concluído?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Concluir", onPress: () => handleConcluir(id) },
      ]
    );
  };

  const cancelarPedido = async (id) => {
    Alert.alert(
      "Confirmar Cancelamento",
      "Tem certeza que deseja cancelar este pedido?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => handleExcluir(id) },
      ]
    );
  };

  const handleExcluir = async (id) => {
    const updatedPedidos = pedidos.filter((p) => p.id !== id);
    setPedidos(updatedPedidos);
    await saveData("pedidos", updatedPedidos);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Adicionar Pedido"
        onPress={() => navigation.navigate("NovoPedido")}
      />
      <Button
        title="Gerenciar Itens"
        onPress={() => navigation.navigate("Itens")}
      />
      <Button
        title="Configurações"
        onPress={() => navigation.navigate("Configuracoes")}
        color="gray"
      />

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              padding: 10,
              backgroundColor: "#f9f9f9",
              marginVertical: 5,
            }}
          >
            <Text
              style={{ color: item.status === "Concluído" ? "gray" : "black" }}
            >
              Pedido #{item.numero}
            </Text>
            <Text
              style={{ color: item.status === "Concluído" ? "gray" : "black" }}
            >
              Cliente: {item.nome || "N/A"}
            </Text>
            <Text
              style={{ color: item.status === "Concluído" ? "gray" : "black" }}
            >
              Telefone: {item.telefone}
            </Text>
            <Text
              style={{ color: item.status === "Concluído" ? "gray" : "black" }}
            >
              Status: {item.status}
            </Text>
            <Text
              style={{ color: item.status === "Concluído" ? "gray" : "black" }}
            >
              Itens:
            </Text>
            {(item.itens || []).map((it, idx) => (
              <Text
                key={it.uniqueId || idx}
                style={{
                  color: item.status === "Concluído" ? "gray" : "black",
                }}
              >
                {it.nome} - R${it.preco}
              </Text>
            ))}

            <View style={styles.buttonContainer}>
              {item.status === "Pendente" ? (
                <>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => concluirPedido(item.id)}
                  >
                    <Text style={styles.buttonText}>Concluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => cancelarPedido(item.id)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleExcluir(item.id)}
                >
                  <Text style={styles.buttonText}>Excluir</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 5,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  buttonText: {
    color: "blue",
  },
});
