import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

import { initDatabase } from '@/services/database';
import { saveQueryImage } from '@/services/datasetService';

export default function SearchCameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [searching, setSearching] = useState(false);
  const [status, setStatus] = useState('Posicione a peça e capture');

  useEffect(() => {
    initDatabase();
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  const handleCaptureAndSearch = async () => {
    if (!cameraRef.current || searching) {
      return;
    }

    setSearching(true);
    setStatus('Capturando foto...');

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo?.uri) {
        throw new Error('Falha ao capturar imagem');
      }

      setStatus('Comparando com dataset local...');
      const queryUri = await saveQueryImage(photo.uri);

    } catch (error) {
      console.warn('Search failed:', error);
      setStatus('Erro na busca. Tente novamente.');
    } finally {
      setSearching(false);
    }
  };

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
      <CameraView ref={cameraRef} style={styles.camera} facing="back" />

      <View style={styles.overlay}>
        <Text style={styles.title}>Buscar peça</Text>
        <Text style={styles.status}>{status}</Text>

        <Pressable
          style={[styles.button, searching && styles.buttonDisabled]}
          onPress={handleCaptureAndSearch}
          disabled={searching}>
          {searching ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Capturar e buscar</Text>
          )}
        </Pressable>

        <Pressable style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    gap: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: 24,
    gap: 16,
  },
  title: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '700',
  },
  status: {
    color: '#cbd5e1',
    fontSize: 15,
  },
  message: {
    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
