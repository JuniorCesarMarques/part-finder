import { Asset } from "expo-asset";
import { loadTensorflowModel, TfliteModel } from "react-native-fast-tflite";

let modelPromise: Promise<TfliteModel> | null = null;

export async function getModel() {
  if (modelPromise) return modelPromise;

  modelPromise = (async () => {
    const asset = Asset.fromModule(
      require("@/assets/models/embedding.tflite")
    );

    await asset.downloadAsync();

    const model = await loadTensorflowModel(
      { url: asset.localUri ?? asset.uri },
      []
    );

    return model;
  })();

  return modelPromise;
}
