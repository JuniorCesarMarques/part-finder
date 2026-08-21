import { MenuAction } from "@/app/(tabs)/partRegister";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props<T> = {
  positions: T | null;
  visible: boolean;
  onClose: () => void;
  menuActions: MenuAction[]
};

export default function ModalPartActions<T>({
  positions,
  visible,
  onClose,
  menuActions
}: Props<T>) {
  if (!positions) return null;


  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.container,
            {
              left: (positions as any).x - 180,
              top: (positions as any).y + 25,
            },
          ]}
        >
          {menuActions.map(a => (
            <Pressable onPress={() => a.action()} key={a.id} style={styles.option}>
            <Text style={styles.optionText}>{a.label}</Text>
          </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },

  container: {
    position: "absolute",
    minWidth: 180,
    backgroundColor: "#FFF",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 6,
  },

  option: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  optionText: {
    color: "black",
    fontSize: 16,
  },
});