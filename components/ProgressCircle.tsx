import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface Props {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

export function ProgressCircle({
  value,
  color,
  size = 42,
  strokeWidth = 5,
}: Props) {
  const radius = (size - strokeWidth) / 2;

  const circumference = radius * 2 * Math.PI;

  const progress = circumference - (value / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#ECECEC"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontWeight: "700",
    fontSize: 11,
    color: "#333",
  },
});