import { Image } from "react-native";

export default function Logo() {
  return (
    <Image
      style={{ width: 210, height: 37 }}
      source={require("@/assets/images/YasLink-logo.png")}
    />
  );
}
