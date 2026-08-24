import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useIsFocused } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import PartResultCard from "@/components/PartResultCard";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { vectorizeImage } from "@/services/ml/vectorizeImage";
import { getPartsWithEmbeddings } from "@/services/partRepository";
import { PartResult } from "@/types";
import { cosineSimilarity } from "@/utils/cosineSimilarity";

import MoreSimilarityParts from "@/components/MoreSimilarityParts";
import SimilarsEmptyState from "@/components/SimilarsEmptyState";
import VerticalizationCard from "@/components/VerticalizationCard";
import Ionicons from "@expo/vector-icons/Ionicons";

import Loading from "@/components/Loading";

import { useSettings } from "@/contexts/SettingsContext";
import { getModel } from "@/services/ml/getModel";
import { router } from "expo-router";

export default function IdentifyPartScreen() {
  const cameraRef = useRef<CameraView>(null);

  const { setHeaderConfig } = useHeaderConfig();

  const isFocused = useIsFocused();

  const [permission, requestPermission] = useCameraPermissions();
  const [state, setState] = useState<"start" | "camera" | "loading" | "result">(
    "start",
  );

  const [photo, setPhoto] = useState<string | null>(null);
  const [results, setResults] = useState<PartResult[]>([]);

  const { settings } = useSettings();

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          setState("start");

          return true;
        },
      );

      return () => subscription.remove();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setHeaderConfig((prev) => {
        return state === "result"
          ? {
              ...prev,
              left: (
                <Ionicons
                  onPress={() => goBackToCamera()}
                  name="chevron-back"
                  size={30}
                  color="#2563EB"
                />
              ),
              title: "Component Details",
            }
          : null;
      });
    }, [state]),
  );

  const goBackToCamera = () => {
    setState("camera");
  };

  const takePhoto = async () => {
    const pic = await cameraRef.current?.takePictureAsync({
      quality: 1,
      skipProcessing: false,
      shutterSound: false,
    });

    if (!pic?.uri) return;

    setPhoto(pic.uri);
    setState("loading");

    const model = await getModel();

    const queryEmbedding = await vectorizeImage(pic.uri, model);

    if (!queryEmbedding) {
      setState("camera");
      return;
    }

    const partsWithEmbeddings = await getPartsWithEmbeddings();

    const bestByPart: Record<string, any> = {};

    for (const part of partsWithEmbeddings as any[]) {
      try {
        const emb = JSON.parse(part.embedding);

        const score = cosineSimilarity(queryEmbedding, emb);

        const current = bestByPart[part.part_id];

        if (!current || score > current.score) {
          bestByPart[part.part_id] = {
            ...part,
            score,
          };
        }
      } catch (error) {
        console.warn("Erro ao processar embedding:", part.id);
      }
    }

    if (!settings) {
      return <Loading />;
    }

    const ranked = Object.values(bestByPart)
      .sort((a: any, b: any) => b.score - a.score)
      .filter((comp) => comp.score * 100 >= settings?.minSimilarity);

    setResults(ranked);
    setState("result");
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <View style={styles.permissionCameraButton}>
          <Text style={{ color: "#FFF" }}>Permissão necessária</Text>
          <Pressable onPress={requestPermission}>
            <Text style={{ color: "#FFF" }}>Ativar câmera</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (state === "start") {
    return (
      <ScrollView style={styles.startStateContainer}>
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🔍</Text>
          </View>
          <Text style={styles.appTitle}>Part Finder</Text>
          <Text style={styles.appDescription}>
            Identify industrial components using AI-powered image recognition.
            Capture a photo and compare it against the registered component
            database.
          </Text>
        </View>
        <View style={styles.featuresCard}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📷</Text>
            <View>
              <Text style={styles.featureTitle}>Capture Component</Text>
              <Text style={styles.featureDescription}>
                Take a clear picture of the part.
              </Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🧠</Text>
            <View>
              <Text style={styles.featureTitle}>AI Recognition</Text>
              <Text style={styles.featureDescription}>
                Generate an embedding and compare with the database.
              </Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📋</Text>
            <View>
              <Text style={styles.featureTitle}>View Results</Text>
              <Text style={styles.featureDescription}>
                Display the most similar registered components.
              </Text>
            </View>
          </View>
        </View>

        <VerticalizationCard
          onPress={() => router.push("/(tabs)/verticalization")}
        />

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Best Results</Text>
          <Text style={styles.tipText}>
            ✓ Keep the component centered{"\n"}✓ Ensure good lighting{"\n"}✓
            Avoid reflections{"\n"}✓ Capture one component at a time
          </Text>
        </View>
        <Pressable
          style={styles.startButton}
          onPress={() => setState("camera")}
        >
          <Text style={styles.startButtonText}>Start Identification</Text>
        </Pressable>
        <Text style={styles.footer}>
          Powered by TensorFlow Lite • On-device AI
        </Text>
      </ScrollView>
    );
  }

  if (state === "camera") {
    return (
      <View style={{ flex: 1 }}>
        {isFocused && (
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />
        )}

        <Pressable style={styles.captureButton} onPress={takePhoto}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Capture</Text>
        </Pressable>
      </View>
    );
  }

  if (state === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Processando embedding...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { flex: 1, padding: 20 }]}>
      {results.length ? (
        <PartResultCard result={results[0]} />
      ) : (
        <SimilarsEmptyState handlePressButton={goBackToCamera} />
      )}
      {/* {results.length > 1 && <MoreSimilarityPartsButton />} */}
      {true && <MoreSimilarityParts results={results.slice(1)} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 20,
  },

  startStateContainer: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 24,
  },

  hero: {
    alignItems: "center",
    marginBottom: 36,
  },

  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    fontSize: 42,
  },

  appTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0F172A",
  },

  appDescription: {
    marginTop: 14,
    textAlign: "center",
    color: "#64748B",
    lineHeight: 24,
    fontSize: 16,
  },

  featuresCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 22,
    marginBottom: 28,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureIcon: {
    fontSize: 22,
    width: 36,
  },

  featureTitle: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 16,
  },

  featureDescription: {
    color: "#64748B",
    marginTop: 2,
  },

  tipCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 20,
    marginBottom: 36,
  },

  tipTitle: {
    color: "#1E3A8A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  tipText: {
    color: "#475569",
    lineHeight: 26,
  },

  startButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },

  startButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 18,
  },

  permissionCameraButton: {
    alignItems: "center",
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
  },

  footer: {
    marginTop: 22,
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 13,
  },

  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    gap: 20,
  },

  infoContainer: {
    gap: 10,
  },

  infoGroup: {
    gap: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  captureButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 12,
  },

  goBackButton: {
    textAlign: "center",
    fontWeight: "600",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    padding: 10,
    marginVertical: 40,
    borderRadius: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#0F172A",
  },
});
