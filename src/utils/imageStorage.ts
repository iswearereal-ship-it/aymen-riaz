// Utility to safely compress and store user images in localStorage without hitting quota limits

export async function processAndCompressImage(file: File, maxSize = 600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Convert an image URL into a high-contrast coloring book sketch outline
export async function convertToSketchOutline(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageSrc);
        return;
      }

      // Draw image fitted
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, 600);

      const scale = Math.min(600 / img.width, 600 / img.height);
      const x = (600 - img.width * scale) / 2;
      const y = (600 - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      const imgData = ctx.getImageData(0, 0, 600, 600);
      const data = imgData.data;
      const width = 600;
      const height = 600;

      // Convert to grayscale first
      const gray = new Float32Array(width * height);
      for (let i = 0; i < data.length; i += 4) {
        // Luminance formula
        gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      }

      // Simple edge detection (Sobel-like difference)
      const output = ctx.createImageData(width, height);
      const outData = output.data;

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          const gx =
            -gray[idx - width - 1] +
            gray[idx - width + 1] -
            2 * gray[idx - 1] +
            2 * gray[idx + 1] -
            gray[idx + width - 1] +
            gray[idx + width + 1];

          const gy =
            -gray[idx - width - 1] -
            2 * gray[idx - width] -
            gray[idx - width + 1] +
            gray[idx + width - 1] +
            2 * gray[idx + width] +
            gray[idx + width + 1];

          const edge = Math.sqrt(gx * gx + gy * gy);
          const pixelIdx = idx * 4;

          // If strong edge, make it black line, otherwise white
          if (edge > 42) {
            outData[pixelIdx] = 30; // dark charcoal
            outData[pixelIdx + 1] = 30;
            outData[pixelIdx + 2] = 30;
            outData[pixelIdx + 3] = 255;
          } else {
            outData[pixelIdx] = 255; // white
            outData[pixelIdx + 1] = 255;
            outData[pixelIdx + 2] = 255;
            outData[pixelIdx + 3] = 255;
          }
        }
      }

      ctx.putImageData(output, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = imageSrc;
  });
}

// LocalStorage safe wrapper
export const storage = {
  get: (key: string, defaultVal: string = ''): string => {
    try {
      return localStorage.getItem(key) || defaultVal;
    } catch {
      return defaultVal;
    }
  },
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      console.warn('LocalStorage quota or storage error:', err);
      return false;
    }
  },
  getJSON: <T>(key: string, defaultVal: T): T => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch {
      return defaultVal;
    }
  },
  setJSON: <T>(key: string, value: T): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('LocalStorage JSON error:', err);
      return false;
    }
  },
};

export interface AppPhotosData {
  puzzlePhoto?: string;
  finalePhoto?: string;
  slotPhotos?: Record<string, string>;
  extraSlots?: any[];
  photoModes?: Record<string, 'sketch' | 'photo'>;
}

export async function fetchServerPhotos(): Promise<AppPhotosData | null> {
  try {
    const res = await fetch('/api/photos');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function savePhotosToServer(data: AppPhotosData): Promise<boolean> {
  try {
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to save to server:', err);
    return false;
  }
}

