import { Alert, Share } from "react-native";

export const compartilharPedido = async (pedido, mensagemBase) => {
  const mensagem = `${mensagemBase}\nPedido #${pedido.numero}\nCliente: ${
    pedido.nome || "N/A"
  }\nItens:\n${pedido.itens.map((i) => `- ${i.nome}`).join("\n")}`;

  try {
    await Share.share({
      message: mensagem,
    });
  } catch (error) {
    Alert.alert("Erro", "Não foi possível compartilhar a mensagem.");
  }
};

export const solicitarCompartilhamento = (pedido, mensagemBase) => {
  Alert.alert(
    "Notificar Cliente",
    "Deseja enviar uma notificação para o cliente?",
    [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => compartilharPedido(pedido, mensagemBase) },
    ]
  );
};
