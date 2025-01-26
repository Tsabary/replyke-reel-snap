import { Image } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export async function resizeIfNeeded(uri: string): Promise<{ uri: string; extension: string }> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      async (originalWidth, originalHeight) => {
        try {
          const maxDim = 800;

          // Extract the file extension from the URI (if available)
          const originalExtensionMatch = uri.match(/\.(\w+)$/);
          const originalExtension = originalExtensionMatch ? originalExtensionMatch[1].toLowerCase() : "jpg";

          // If the image is small enough, keep the original extension
          if (originalWidth <= maxDim && originalHeight <= maxDim) {
            return resolve({ uri, extension: originalExtension });
          }

          // Resize logic
          let newWidth: number;
          let newHeight: number;

          if (originalWidth > originalHeight) {
            // Landscape image -> limit width to 800, scale height
            const scaleFactor = maxDim / originalWidth;
            newWidth = Math.floor(originalWidth * scaleFactor);
            newHeight = Math.floor(originalHeight * scaleFactor);
          } else {
            // Portrait or square -> limit height to 800, scale width
            const scaleFactor = maxDim / originalHeight;
            newWidth = Math.floor(originalWidth * scaleFactor);
            newHeight = Math.floor(originalHeight * scaleFactor);
          }

          // Manipulate the image
          const { uri: resizedUri } = await manipulateAsync(
            uri,
            [{ resize: { width: newWidth, height: newHeight } }],
            { compress: 0.7, format: SaveFormat.JPEG }
          );

          resolve({ uri: resizedUri, extension: "jpg" });
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
