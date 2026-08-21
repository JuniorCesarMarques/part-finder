import { Settings } from "@/types/settings";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type SettingsModalProps = {
  initialSettings: Settings;
  onSave: (settings: Settings) => Promise<void>;
  closeModal: () => void;
};

export default function SettingsModal({
  initialSettings,
  closeModal,
  onSave,
}: SettingsModalProps) {
  const { control, handleSubmit, watch, reset } = useForm<Settings>({
    defaultValues: initialSettings,
  });

  const minSimilarity = watch("minSimilarity");

  console.log(initialSettings);
  async function submit(data: Settings) {
    await onSave(data);
    closeModal();
  }

  useEffect(() => {
    reset(initialSettings);

    console.log(initialSettings);
  }, [initialSettings, reset]);

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Pressable style={styles.closeButton} onPress={closeModal}>
          <Ionicons name="close" size={20} color="#0F172A" />
        </Pressable>

        <Text style={styles.title}>Settings</Text>

        <Text style={styles.subtitle}>Adjust the application parameters.</Text>

        <Text style={styles.label}>Minimum Similarity</Text>

        <Text style={styles.value}>≥ {minSimilarity}%</Text>

        <Controller
          control={control}
          name="minSimilarity"
          render={({ field: { value, onChange } }) => (
            <Slider
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={value}
              onValueChange={onChange}
              minimumTrackTintColor="#2563EB"
              maximumTrackTintColor="#CBD5E1"
              thumbTintColor="#2563EB"
            />
          )}
        />

        <Text style={[styles.label, { marginTop: 24 }]}>
          Maximum Captures
        </Text>

        <Controller
          control={control}
          name="minPhotos"
          render={({ field: { value, onChange } }) => (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(value)}
              onChangeText={(text) => {
                if (text === "") {
                  onChange(0);
                  return;
                }

                const number = Number(text);

                if (!Number.isNaN(number)) {
                  onChange(number);
                }
              }}
            />
          )}
        />

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.cancel]}
            onPress={closeModal}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.save]}
            onPress={handleSubmit(submit)}
          >
            <Text style={styles.saveText}>Save Changes</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#F1F5F9",
    padding: 6,
    borderRadius: 20,
    zIndex: 1,
  },

  title: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    paddingRight: 30,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
  },

  label: {
    color: "#0F172A",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  value: {
    color: "#2563EB",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#0F172A",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 10,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cancel: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  save: {
    backgroundColor: "#2563EB",
  },

  cancelText: {
    color: "#475569",
    fontWeight: "600",
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
