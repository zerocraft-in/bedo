import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";

export default function WorkoutVerificationScreen() {
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} />

      <View style={styles.overlay}>
        <Text style={styles.counter}>
          Pushups: 12
        </Text>

        <Text style={styles.status}>
          Pose Detected ✅
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 60,
    left: 20,
  },
  counter: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  status: {
    color: "#00FF88",
    marginTop: 10,
  },
});