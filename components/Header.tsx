import { useHeaderConfig } from "@/contexts/HeaderContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Logo from "./Logo";
import SettingsModal from "./SettingsModal";
import { useSettings } from "@/contexts/SettingsContext";

export default function Header() {
  const [modalState, setModalState] = useState(false);

  const { headerConfig } = useHeaderConfig();
  const { settings, saveSettings } = useSettings();

  const closeSettingsModal = () => {
    setModalState(false);
  };

  return (
    <View style={styles.container}>
      {headerConfig?.left ? headerConfig.left : <Logo />}
      <Text style={styles.text}>{headerConfig?.title}</Text>
      {headerConfig?.right ? (
        headerConfig.right
      ) : (
        <View>
          <Pressable
            onPress={() => setModalState((prev) => !prev)}
            style={styles.iconContainer}
          >
            <Ionicons name="settings-sharp" size={24} color="#f8fafc" />
          </Pressable>

          {modalState && settings !== null && (
            <Modal transparent visible={modalState}>
              <SettingsModal
                initialSettings={settings}
                onSave={saveSettings}
                closeModal={closeSettingsModal}
              />
            </Modal>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    paddingTop: 45,
    paddingBottom: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  iconContainer: {
    padding: 10,
    backgroundColor: "#2563EB",
    borderRadius: 999,
  },

  text: {
    fontSize: 20,
    color: "#0F172A",
    fontWeight: "700",
  },
});
