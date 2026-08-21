import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { initDatabase } from "@/services/database";
import deletePartsById, {
  getPartsSummary,
  updatePart,
} from "@/services/partRepository";
import type { Part, PartWithCount } from "@/types";

import ModalPartActions from "@/components/ModalPartActions";
import PartFormFields from "@/components/PartFormFields";
import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useSettings } from "@/contexts/SettingsContext";
import { createPartWithId } from "@/services/datasetService";
import { FontAwesome6 } from "@expo/vector-icons";
import { SubmitHandler } from "react-hook-form";
import Toast from "react-native-toast-message";

type Inputs = Part;

type MenuPositionType = {
  x: number;
  y: number;
};

export type MenuAction = {
  id: number;
  label: string;
  action: () => void;
};

export type FormMode = "editing" | "creating";

export default function DatasetCaptureSetupScreen() {
  const [parts, setParts] = useState<PartWithCount[]>([]);

  const [loading, setLoading] = useState(true);

  const [partModal, setPartModal] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPositionType | null>(
    null,
  );

  const ellipsesRef = useRef<View>(null);

  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const { headerConfig, setHeaderConfig } = useHeaderConfig();

  const { settings } = useSettings();

  const selectedPart = parts.find((p) => p.id === selectedParts[0]);

  const openFormModal = async (mode: "create" | "edit") => {
    setOptionsVisible(false);

    if (mode === "create") {
      setSelectedParts([]);
    }

    setPartModal(true);
  };

  const deleteParts = () => {
    setOptionsVisible(false);

    Alert.alert(
      `Delete ${selectedParts.length > 1 ? "components" : "component"}`,
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const res = await deletePartsById(selectedParts);

            if (res.changes) {
              Toast.show({
                type: "success",
                text1: "Success",
                text2: `${selectedParts.length > 1 ? "components" : "component"} deleted successfully.`,
              });

              setSelectedParts([]);
              setParts((prev) =>
                prev.filter((p) => !selectedParts.includes(p.id)),
              );
            } else {
              Toast.show({
                type: "error",
                text1: "Error",
                text2: `${selectedParts.length > 1 ? "components" : "component"} deleted successfully.`,
              });
            }
          },
        },
      ],
    );
  };

  const menuActions: MenuAction[] = [
    ...(selectedParts.length > 1
      ? []
      : [{ id: 1, label: "Edit", action: () => openFormModal("edit") }]),
    { id: 2, label: "Delete", action: deleteParts },
  ];

  const onsubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let res;

      if (selectedParts.length) {
        res = await updatePart(selectedParts[0], data);
      } else {
        res = await createPartWithId(data);
      }

      if (res.changes) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: `Component ${!selectedParts.length ? "created" : "updated"} successfully.`,
        });

        setSelectedParts([]);
        setPartModal(false);
      }

      loadParts();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create the component.",
      });
    }
  };

  const loadParts = async () => {
    setLoading(true);
    try {
      await initDatabase();
      const loadedParts = await getPartsSummary();
      setParts(loadedParts);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadParts();
    }, []),
  );

  const handleStartCapture = (part: PartWithCount) => {

      if (settings && part.images >= settings.minPhotos) {
        Toast.show({
          type: "info",
          text1: "Dataset is complete",
          text2: `The required ${settings.minPhotos} images have been captured.`
        });

        return;
      }

    router.push({
      pathname: "/dataset-capture",
      params: { partId: part.id, partNumber: part.partNumber },
    });
  };

  useEffect(() => {
    setHeaderConfig((prev) => {
      return selectedParts.length
        ? {
            ...prev,
            right: (
              <Pressable
                ref={ellipsesRef}
                onPress={() => {
                  ellipsesRef.current?.measureInWindow(
                    (x, y, width, height) => {
                      setMenuPosition({
                        x,
                        y: y + height,
                      });
                    },
                  );

                  setOptionsVisible(true);
                }}
              >
                <FontAwesome6
                  name="ellipsis-vertical"
                  size={24}
                  color="#2563eb"
                />
              </Pressable>
            ),
          }
        : { ...prev, right: null };
    });
  }, [selectedParts]);

  const handleSelectPart = (item: PartWithCount) => {
    setSelectedParts((prev) => {
      return selectedParts.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id];
    });
  };

  const onModalActionsClose = () => {
    setOptionsVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Dataset Capture</Text>
          <Text style={styles.subtitle}>
            Create a part type and automatically capture the photos.
          </Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => openFormModal("create")}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </Pressable>
      </View>
      <Modal visible={partModal}>
        <View
          style={{
            alignItems: "flex-end",
            paddingVertical: 14,
          }}
        >
          <Pressable
            onPress={() => setPartModal(false)}
            style={{
              padding: 8,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                backgroundColor: "red",
                padding: 5,
                borderRadius: 3,
              }}
            >
              ✕
            </Text>
          </Pressable>
        </View>
        <PartFormFields onsubmit={onsubmit} selectedPart={selectedPart} />
      </Modal>
      <Text style={styles.sectionTitle}>Registered Components</Text>
      <FlatList
        data={parts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No parts have been registered yet.</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.card,
              selectedParts.includes(item.id) && {
                backgroundColor: "#EFF6FF",
                borderColor: "#2563EB",
              },
            ]}
            onLongPress={() => handleSelectPart(item)}
            onPress={() => {
              if (selectedParts.length) {
                handleSelectPart(item);
                return;
              }
              handleStartCapture(item);
            }}
          >
            <View>
              <Text style={styles.cardTitle}>{item.partNumber}</Text>
              <Text style={styles.cardMeta}>
                {item.images} images in the Dataset
              </Text>
            </View>
            <Text style={styles.cardAction}>Capture</Text>
          </Pressable>
        )}
      />
      {/* MODAL AÇÕES*/}
      <ModalPartActions
        menuActions={menuActions}
        visible={optionsVisible}
        onClose={onModalActionsClose}
        positions={menuPosition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 20,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    marginBottom: 16,
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 16,
    lineHeight: 22,
  },

  formContainer: {
    paddingBottom: 20,
  },

  form: {
    gap: 12,
  },

  label: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#0F172A",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  sectionTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
  },

  listContent: {
    gap: 12,
    paddingBottom: 40,
  },

  emptyText: {
    color: "#94A3B8",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  cardTitle: {
    color: "#0F172A",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 4,
  },

  cardMeta: {
    color: "#64748B",
    fontSize: 14,
  },

  cardAction: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 15,
  },

  dropdownWrapper: {
    zIndex: 1000,
    elevation: 1000,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 12,
  },

  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
  },
});
