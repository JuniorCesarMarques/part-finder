import { View } from "react-native";

export function DevicePreview({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ width, flex: 1 }}>{children}</View>
    </View>
  );
}
