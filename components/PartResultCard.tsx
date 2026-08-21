import { PartResult } from "@/types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type PartResultCardProps = {
  result: PartResult;
};

export default function PartResultCard({ result }: PartResultCardProps) {
  const mock = {
    status: "Active",
    unit: "PC",
    country: "Japan",
    price: 1.28,
    priceVariation: "-3.2% vs last 90 days",
    leadTime: "10 weeks",
    stock: "24,500 pcs",
    obsolescence: "Active",
    riskLevel: "Low",
    supplier: "Yazaki",
    family: "Connectors",
  };

  const [imageIsOpen, setImageIsOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (imageIsOpen) {
      setImageLoading(true);
      setImageError(false);
    }
  }, [imageIsOpen]);

  const openImage = () => {
    setImageError(false);
    setImageLoading(true);
    setImageIsOpen(true);
  };

  const closeImage = () => {
    setImageIsOpen(false);
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <View style={styles.card}>
      {/* IMAGEM DA CARD */}
      <Pressable onPress={openImage}>
        <Image
          source={{ uri: result.uri }}
          style={styles.image}
          resizeMode="cover"
        />
      </Pressable>

      {/* IMAGEM AMPLIADA */}
      <Modal
        visible={imageIsOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeImage}
      >
        <View style={styles.modal}>
          {/* Fundo clicável */}
          <Pressable style={styles.modalBackdrop} onPress={closeImage} />

          {/* Área da imagem */}
          <View style={styles.imageContainer}>
            {imageLoading && !imageError && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
              </View>
            )}

            {imageError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Não foi possível carregar a imagem.
                </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={closeImage}
                >
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </Pressable>
              </View>
            ) : (
              <Image
                source={{ uri: result.uri }}
                style={styles.openImage}
                resizeMode="contain"
                onLoadStart={() => {
                  setImageLoading(true);
                  setImageError(false);
                }}
                onLoad={() => {
                  setImageLoading(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
            )}

            {!imageError && (
              <Pressable
                style={styles.closeButton}
                onPress={closeImage}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.partNumber}>{result.partNumber}</Text>

            <Text style={styles.description}>{result.description}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {(result.score * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.item}>
            <Text style={styles.label}>Supplier</Text>
            <Text style={styles.value}>{result.supplier}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Family</Text>
            <Text style={styles.value}>{result.family}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Unit of Measure</Text>
            <Text style={styles.value}>{mock.unit}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Country</Text>
            <Text style={styles.value}>{mock.country}</Text>
          </View>
        </View>

        <View style={styles.priceSection}>
          <View>
            <Text style={styles.label}>Current Price (USD)</Text>

            <Text style={styles.price}>
              ${mock.price.toFixed(2)}
            </Text>

            <Text style={styles.variation}>
              {mock.priceVariation}
            </Text>
          </View>

          <View style={styles.chart}>
            <View style={[styles.line, { height: 20 }]} />
            <View style={[styles.line, { height: 35 }]} />
            <View style={[styles.line, { height: 25 }]} />
            <View style={[styles.line, { height: 50 }]} />
            <View style={[styles.line, { height: 65 }]} />
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.item}>
            <Text style={styles.label}>Lead Time</Text>
            <Text style={styles.value}>{mock.leadTime}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Stock (Global)</Text>
            <Text style={styles.value}>{mock.stock}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Obsolescence Status</Text>
            <Text style={styles.value}>{mock.obsolescence}</Text>
          </View>

          <View style={styles.item}>
            <Text style={styles.label}>Risk Level</Text>
            <Text style={[styles.value, styles.lowRisk]}>
              {mock.riskLevel}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "#FFF",
    borderRadius: 18,
    overflow: "hidden",
    marginVertical: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  image: {
    width: "100%",
    height: 240,
  },

  /*
   * MODAL
   */

  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  imageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  openImage: {
    width: "100%",
    height: "80%",
  },

  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  errorText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },

  closeButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2563EB",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },

  /*
   * CARD
   */

  content: {
    padding: 18,
  },

  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  partNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  description: {
    marginTop: 4,
    color: "#475569",
    fontSize: 16,
  },

  badge: {
    justifyContent: "center",
    backgroundColor: "#DCFCE7",
    padding: 10,
    borderRadius: 12,
  },

  badgeText: {
    color: "#166534",
    fontWeight: "700",
    fontSize: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },

  item: {
    width: "47%",
  },

  label: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 4,
  },

  value: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },

  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 25,
  },

  price: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },

  variation: {
    color: "#16A34A",
    fontSize: 12,
    marginTop: 4,
  },

  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 5,
    height: 70,
  },

  line: {
    width: 5,
    backgroundColor: "#3B82F6",
    borderRadius: 5,
  },

  lowRisk: {
    color: "#16A34A",
  },
});