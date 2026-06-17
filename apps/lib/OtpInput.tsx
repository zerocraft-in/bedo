// lib/OtpInput.tsx
// 6-box OTP input used on both login and register verify screens.

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from "react-native";
import { useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

export default function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const inputs = useRef<(TextInput | null)[]>([]);

  const chars = value.split("").concat(Array(length).fill("")).slice(0, length);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = chars.map((c, i) => (i === index ? digit : c)).join("");
    onChange(next);
    if (digit && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) {
    if (e.nativeEvent.key === "Backspace" && !chars[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  return (
    <View>
      <View style={styles.row}>
        {chars.map((char, i) => (
          <TextInput
            key={i}
            ref={(r) => { inputs.current[i] = r; }}
            value={char}
            onChangeText={(t) => handleChange(t, i)}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={[
              styles.box,
              !!char && styles.boxFilled,
              !!error && styles.boxError,
            ]}
            selectionColor="#ca8a04"
            caretHidden
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  box: {
    width: 48,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  boxFilled: {
    borderColor: "#ca8a04",
    backgroundColor: "rgba(202,138,4,0.1)",
  },
  boxError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 8,
    textAlign: "center",
  },
});