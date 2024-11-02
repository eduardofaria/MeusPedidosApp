
import { Alert, Linking } from "react-native";

// Função para abrir o aplicativo de mensagens SMS com número e mensagem preenchidos
export const compartilharPorSMS = async (pedido, mensagemBase) => {
  const numeroFormatado = pedido.telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
  const mensagem = `${mensagemBase}\nPedido #${pedido.numero}\nCliente: ${
    pedido.nome || "N/A"
  }\nItens:\n${pedido.itens.map((i) => `- ${i.nome}`).join("\n")}`;

  const url = `sms:${numeroFormatado}?body=${encodeURIComponent(mensagem)}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert("Erro", "Não foi possível abrir o aplicativo de SMS.");
  }
};

// Função para abrir o WhatsApp com o número e mensagem preenchidos
export const compartilharPorWhatsApp = async (pedido, mensagemBase) => {
  const numeroFormatado = pedido.telefone.replace(/\D/g, ""); // Remove caracteres não numéricos
  const mensagem = `${mensagemBase}\nPedido #${pedido.numero}\nCliente: ${
    pedido.nome || "N/A"
  }\nItens:\n${pedido.itens.map((i) => `- ${i.nome}`).join("\n")}`;
  const url = `whatsapp://send?phone=${numeroFormatado}&text=${encodeURIComponent(
    mensagem
  )}`;

  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      "Erro",
      "Não foi possível abrir o WhatsApp. Verifique se o WhatsApp está instalado."
    );
  }
};

// Função que pergunta ao usuário se deseja enviar por SMS ou WhatsApp
export const solicitarCompartilhamento = (pedido, mensagemBase) => {
  Alert.alert(
    "Notificar Cliente",
    "Deseja enviar uma notificação para o cliente?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Enviar por SMS",
        onPress: () => compartilharPorSMS(pedido, mensagemBase),
      },
      {
        text: "Enviar por WhatsApp",
        onPress: () => compartilharPorWhatsApp(pedido, mensagemBase),
      },
    ]
  );
};









/*
Usando o menu nativo de compartilhamento:


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
*/