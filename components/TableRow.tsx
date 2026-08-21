import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";

import { ProgressCircle } from "./ProgressCircle";

interface Props {
  rank: number;
  componentCode: string;
  description: string;
  globalConsumption: string;
  priceTrend: number;
  commercialization: number;
  verticalization: number;
}

export function TableRow({
  rank,
  componentCode,
  description,
  globalConsumption,
  priceTrend,
  commercialization,
  verticalization,
}: Props) {
  const { width } = useWindowDimensions();

  const compact = width < 950;

  const trendColor = priceTrend >= 0 ? "#EF4444" : "#22C55E";

  const trendArrow = priceTrend >= 0 ? "▲" : "▼";

  const trendText =
    priceTrend >= 0
      ? `+${priceTrend}% (Rising)`
      : `${priceTrend}% (Falling)`;

  return (
    <View style={styles.container}>
      <View style={styles.rankContainer}>
        <View style={styles.rankBadge}>
          <Text style={styles.rank}>{rank}</Text>
        </View>
      </View>

      <View style={[styles.codeContainer, compact && { flex: 1.4 }]}>
        <Text style={styles.code}>{componentCode}</Text>
      </View>

      <View style={[styles.descriptionContainer, compact && { flex: 2 }]}>
        <Text style={styles.description}>{description}</Text>
      </View>

      {!compact && (
        <View style={styles.consumptionContainer}>
          <Text style={styles.value}>{globalConsumption}</Text>
        </View>
      )}

      <View style={styles.trendContainer}>
        <Text style={[styles.trend, { color: trendColor }]}>
          {trendArrow} {trendText}
        </Text>
      </View>

      <View style={styles.circleContainer}>
        <ProgressCircle
          value={commercialization}
          color="#34C759"
        />
      </View>

      <View style={styles.circleContainer}>
        <ProgressCircle
          value={verticalization}
          color="#7C3AED"
        />
      </View>

      <View style={styles.actionContainer}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            View Details →
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
    minHeight: 74,
    paddingHorizontal: 20,
  },

  rankContainer: {
    width: 55,
    alignItems: "center",
  },

  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,

    backgroundColor: "#6C3CF0",

    justifyContent: "center",
    alignItems: "center",
  },

  rank: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 13,
  },

  codeContainer: {
    flex: 1.2,
  },

  code: {
    fontWeight: "700",
    color: "#5B3DF5",
    fontSize: 15,
  },

  descriptionContainer: {
    flex: 2,
    paddingRight: 15,
  },

  description: {
    color: "#444",
    fontSize: 13,
    lineHeight: 18,
  },

  consumptionContainer: {
    width: 100,
    alignItems: "center",
  },

  value: {
    fontWeight: "600",
    color: "#444",
    fontSize: 14,
  },

  trendContainer: {
    width: 140,
    alignItems: "center",
  },

  trend: {
    fontSize: 12,
    fontWeight: "600",
  },

  circleContainer: {
    width: 80,
    alignItems: "center",
  },

  actionContainer: {
    width: 130,
    alignItems: "flex-end",
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6C3CF0",
    backgroundColor: "#FFF",
  },

  buttonText: {
    color: "#6C3CF0",
    fontWeight: "600",
    fontSize: 13,
  },
});