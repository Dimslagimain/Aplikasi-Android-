import * as tf from '@tensorflow/tfjs';
import { registerRootComponent } from 'expo';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

// Daftar kelas sesuai model
const CLASS_NAMES = ['Daun Sirsak', 'Daun Salam', 'Daun Mint', 'Daun Kersen', 'Daun Katu'];

export default function App() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Ganti dengan URL Netlify model.json Anda
  const MODEL_URL = 'https://coruscating-zuccutto-dafc26.netlify.app/model.json';

  // Load model
  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const loadedModel = await tf.loadLayersModel(MODEL_URL);
        setModel(loadedModel);
        setIsModelLoaded(true);
        console.log('✅ Model loaded');
        // Warmup
        const dummy = tf.zeros([1, 224, 224, 3]) as tf.Tensor4D;
        const pred = loadedModel.predict(dummy) as tf.Tensor;
        dummy.dispose();
        (pred as tf.Tensor).dispose();
      } catch (error) {
        console.error('❌ Failed to load model', error);
        Alert.alert('Error', 'Gagal memuat model. Menggunakan demo mode.');
      }
    };
    loadModel();
  }, []);

  // Preprocess image menjadi tensor 4D [1, 224, 224, 3]
  const preprocessImage = async (uri: string): Promise<tf.Tensor4D> => {
    const resized = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );

    const response = await fetch(resized.uri);
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);

    let tensor = tf.browser.fromPixels(bitmap).toFloat();

    // Pastikan ukurannya [224,224]
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);

    // Normalisasi & tambahkan batch dim
    const expanded = tensor.expandDims(0).div(tf.scalar(255)) as tf.Tensor4D;

    console.log("Tensor shape:", expanded.shape); // Debugging

    return expanded;
  };

  const predictImage = async (uri: string) => {
    setLoading(true);
    setPrediction(null);
    setConfidence(null);

    try {
      if (!model) {
        // fallback demo mode
        const randomIdx = Math.floor(Math.random() * CLASS_NAMES.length);
        setPrediction(CLASS_NAMES[randomIdx]);
        setConfidence(Math.floor(Math.random() * 30 + 70));
      } else {
        const tensor = await preprocessImage(uri);
        const predTensor = model.predict(tensor) as tf.Tensor;
        const data = await predTensor.data();
        const maxIdx = data.indexOf(Math.max(...data));
        setPrediction(CLASS_NAMES[maxIdx] || `Class ${maxIdx}`);
        setConfidence(Math.round(data[maxIdx] * 100));
        tensor.dispose();
        predTensor.dispose();
      }
    } catch (error) {
      console.error('Prediction error', error);
      Alert.alert('Error', 'Gagal memprediksi gambar');
    }

    setLoading(false);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      predictImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({ base64: false });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      predictImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌿 Leaf Detection App 🌿</Text>

      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>📸 Ambil Gambar</Text>
        )}
      </View>

      {prediction && (
        <Text style={styles.result}>
          Prediction: {prediction} {confidence !== null && `(${confidence}%)`}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>📸 Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>🖼 Pick from Gallery</Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 10 }} />
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🌱 Pastikan daun terlihat jelas dan fokus untuk hasil AI yang optimal.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: 'center', padding: 20, backgroundColor: '#f8fff8' },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#2e7d32' },
  imageContainer: {
    width: '90%',
    height: 250,
    borderRadius: 20,
    backgroundColor: '#e0f2f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4caf50',
    marginBottom: 15,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', borderRadius: 20, resizeMode: 'cover' },
  imagePlaceholderText: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  button: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginTop: 12,
    width: '70%',
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  result: { fontSize: 18, marginTop: 10, fontWeight: '600', color: '#1b5e20' },
  infoBox: {
    width: '90%',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  infoText: { fontSize: 16, color: '#2e7d32', textAlign: 'center' },
});

registerRootComponent(App);
