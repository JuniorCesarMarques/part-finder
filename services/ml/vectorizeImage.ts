import * as ImageManipulator from "expo-image-manipulator";
import jpeg from "jpeg-js";

export async function vectorizeImage(uri: string, model: any) {
  try {

    const resized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG, base64: true }
    );

    if (!resized.base64) return null;

    const binaryStr = atob(resized.base64);
    const jpegBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      jpegBytes[i] = binaryStr.charCodeAt(i)!;
    }

    const { data: rgba } = jpeg.decode(jpegBytes, { useTArray: true });

    const input = new Float32Array(224 * 224 * 3);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
      input[j]!     = (rgba[i]! - 127.5) / 127.5;    
      input[j + 1]! = (rgba[i + 1]! - 127.5) / 127.5; 
      input[j + 2]! = (rgba[i + 2]! - 127.5) / 127.5; 

    }

    const output = await model.run([input.buffer]);
    const raw = output?.[0];
    if (!raw) return null;

    return Array.from(new Float32Array(raw));

  } catch (e) {
    console.log("vectorize error:", e);
    return null;
  }
}