import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  CAPTURE_INTERVAL_MS,
  saveCapturedImage,
} from "@/services/datasetService";
import {
  countImagesByPartId,
  getImagesByPartId,
  saveEmbedding,
} from "@/services/partRepository";

import { vectorizeImage } from "@/services/ml/vectorizeImage";
import { useSettings } from "@/contexts/SettingsContext";
import { getModel } from "@/services/ml/getModel";


export default function DatasetCaptureScreen() {
  const { partId, partNumber } = useLocalSearchParams<{
    partId: string;
    partNumber: string;
  }>();

  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [capturing, setCapturing] = useState(false);
  const [finished, setFinished] = useState(false);

  const [totalImages, setTotalImages] = useState(0);

  const [status, setStatus] = useState("");

  const { settings } = useSettings();

  const capturingRef = useRef(false);
  const vetorizandoRef = useRef(false);


  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);


  useEffect(() => {
    (async () => {
      const res = await countImagesByPartId(partId);
      setTotalImages(res);
    })();
  }, []);


  const runAutoCapture = useCallback(async () => {
    if (!partId || capturingRef.current || !cameraRef.current || !settings) {
      return;
    }

    capturingRef.current = true;
    setCapturing(true);
    setFinished(false);


  const remainingCaptures = settings.minPhotos - totalImages;

    for (let index = 0; index < remainingCaptures; index++) {
      if (!cameraRef.current) {
        break;
      }

      try {
        setStatus(`Salvando foto ${index + 1}/${settings?.minPhotos}`);

        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.6,
          skipProcessing: true,
          shutterSound: false,
        });

        if (photo?.uri) {
          await saveCapturedImage(partId, photo.uri);
          const res = await countImagesByPartId(partId);

          setTotalImages(res);
          setStatus(`Salvando foto ${index + 1}/${settings?.minPhotos}`);
        }
      } catch (error) {
        console.warn("Capture failed:", error);
      }

      if (index < remainingCaptures - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, CAPTURE_INTERVAL_MS),
        );
      }
    }

    setStatus("Iniciando vetorização...");
    console.log("Iniciando vetorização");
    vetorizandoRef.current = true;

    const model = await getModel();

    const images = await getImagesByPartId(partId);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      try {
        setStatus(`Vetorizando ${i + 1}/${images.length}`);

        const embedding = await vectorizeImage(img.uri, model);

        if (embedding) {
          await saveEmbedding(img.id, embedding);
        }
      } catch (err) {
        console.warn("Vectorization failed:", err);
      }
    }

    setStatus("Concluído");
    setFinished(true);
    setCapturing(false);
    capturingRef.current = false;
    vetorizandoRef.current = false;
  }, [partId, totalImages, settings]);


  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }


  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>Permissão de câmera necessária.</Text>

        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permissão</Text>
        </Pressable>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back" mute />

      <View style={styles.overlay}>
        {!capturing && !finished && (
          <>
            <Text style={styles.partName}>{partNumber ?? "Peça"}</Text>

            <Text style={styles.status}>
              Posicione a peça e pressione iniciar.
            </Text>

            <Text style={styles.progress}>
              {totalImages} / {settings?.minPhotos}
            </Text>

            <Pressable style={styles.button} onPress={runAutoCapture}>
              <Text style={styles.buttonText}>Iniciar captura</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => router.back()}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </Pressable>
          </>
        )}

        {capturing && (
          <View style={[styles.capturginContainer]}>
            <View style={styles.recordDot} />

            {!vetorizandoRef.current ? (
              <View>
                <Text style={styles.recordingTitle}>
                  Capturando Dataset {totalImages}
                </Text>

                <Text style={styles.recordingSubtitle}>
                  Mova o dispositivo lentamente ao redor da peça para capturar
                  diferentes ângulos.
                </Text>
              </View>
            ) : (
              <Text style={styles.recordingTitle}>{status}</Text>
            )}
          </View>
        )}

        {finished && (
          <>
            <Text style={styles.recordingTitle}>Captura concluída</Text>

            <Pressable style={styles.button} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Voltar</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    backgroundColor: "rgba(15,23,42,0.85)",
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  message: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },

  partName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  status: {
    color: "#cbd5e1",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },

  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#94a3b8",
  },

  capturginContainer: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 30,
  },

  recordDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ef4444",
    marginBottom: 12,
  },

  recordingTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  recordingSubtitle: {
    color: "#cbd5e1",
    marginTop: 6,
    fontSize: 15,
  },

  timer: {
    color: "#60a5fa",
    marginTop: 16,
    fontSize: 32,
    fontWeight: "800",
  },
  progress: {
    color: "#60a5fa",
    fontSize: 32,
    fontWeight: "800",
  },
});
