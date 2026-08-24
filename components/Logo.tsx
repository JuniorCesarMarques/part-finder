import { router } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

export default function Logo() {

  const goBackHome = () => {
    router.push("/");
  }


  return (
    <TouchableOpacity onPress={goBackHome}>
      <Image
        style={{ width: 210, height: 37 }}
        source={require("@/assets/images/YasLink-logo.png")}
      />
    </TouchableOpacity>
  );
}
