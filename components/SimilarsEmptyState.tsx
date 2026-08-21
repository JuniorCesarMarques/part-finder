
import { View, Text, Pressable, StyleSheet } from "react-native";

type SimilarsEmptyStateProps = {
    handlePressButton: () =>  void;
}

export default function SimilarsEmptyState({handlePressButton}: SimilarsEmptyStateProps){

    return (
<View style={styles.emptyState}>
  <Text style={styles.emptyIcon}>🔍</Text>

  <Text style={styles.emptyTitle}>
    Nenhuma peça encontrada
  </Text>

  <Text style={styles.emptyDescription}>
    Não foi possível encontrar uma peça com similaridade acima do limite
    configurado.
  </Text>

  <Text style={styles.emptyTips}>
    • Tire a foto com boa iluminação.{"\n"}
    • Centralize a peça na imagem.{"\n"}
    • Verifique se ela faz parte da base cadastrada.
  </Text>

  <Pressable onPress={handlePressButton} style={styles.button}>
    <Text style={styles.buttonText}>Capturar nova foto</Text>
  </Pressable>
</View>
    )
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  emptyIcon: {
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#0F172A",
  },

  emptyDescription: {
    textAlign: "center",
    color: "#64748B",
    lineHeight: 22,
    marginBottom: 20,
  },

  emptyTips: {
    color: "#475569",
    lineHeight: 24,
    textAlign: "left",
    alignSelf: "stretch",
    marginBottom: 32,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    alignSelf: "stretch",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});