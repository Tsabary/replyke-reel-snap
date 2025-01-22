import { Image } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export async function resizeIfNeeded(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      async (originalWidth, originalHeight) => {
        try {
          // 2) Compute target dimensions
          const maxDim = 800;

          // If it’s already small enough, skip resizing
          if (originalWidth <= maxDim && originalHeight <= maxDim) {
            return resolve(uri); // no change needed
          }

          // Figure out which side is bigger
          if (originalWidth > originalHeight) {
            // Landscape image -> limit width to 800, scale height
            const scaleFactor = maxDim / originalWidth;
            const newWidth = Math.floor(originalWidth * scaleFactor);
            const newHeight = Math.floor(originalHeight * scaleFactor);

            // 3) Manipulate
            const { uri: resizedUri } = await manipulateAsync(
              uri,
              [{ resize: { width: newWidth, height: newHeight } }],
              { compress: 0.7, format: SaveFormat.JPEG }
            );
            resolve(resizedUri);
          } else {
            // Portrait or square -> limit height to 800, scale width
            const scaleFactor = maxDim / originalHeight;
            const newWidth = Math.floor(originalWidth * scaleFactor);
            const newHeight = Math.floor(originalHeight * scaleFactor);

            const { uri: resizedUri } = await manipulateAsync(
              uri,
              [{ resize: { width: newWidth, height: newHeight } }],
              { compress: 0.7, format: SaveFormat.JPEG }
            );
            resolve(resizedUri);
          }
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
}
