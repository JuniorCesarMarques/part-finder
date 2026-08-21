import { PartResult } from "@/types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

type Props = {
  results: PartResult[];
  onPress?: (part: PartResult) => void;
};

export default function MoreSimilarityParts({ results, onPress }: Props) {
  const [showMore, setShowMore] = useState(false);

  if (!results.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => setShowMore((prev) => !prev)}
      >
        <Text style={styles.moreText}>
          {showMore ? "Hide similar parts" : "View more similar parts"}
        </Text>

        <Text style={styles.arrow}>
          {showMore ? "⌃" : "›"}
        </Text>
      </TouchableOpacity>

      {showMore && (
        <>
          {results.map((part) => (
            <TouchableOpacity
              key={part.partNumber}
              style={styles.card}
              onPress={() => onPress?.(part)}
            >
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>
                  {(part.score * 100).toFixed(1)}%
                </Text>
              </View>

              <Image
                source={{ uri: part.uri }}
                style={styles.image}
              />

              <View style={styles.content}>
                <Text style={styles.partNumber}>
                  {part.partNumber}
                </Text>

                <Text
                  style={styles.description}
                  numberOfLines={2}
                >
                  {part.description}
                </Text>

                <Text style={styles.info}>
                  {part.supplier} • {part.family}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingBottom: 40,
  },

  moreButton: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },

  moreText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 14,
  },

  arrow: {
    color: "#2563EB",
    fontSize: 25,
  },

  card: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },

  scoreBadge: {
    position: "absolute",
    top: 10,
    right: 12,
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 1,
  },

  scoreText: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 12,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    paddingRight: 60, // evita que o texto fique atrás do badge
  },

  partNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  description: {
    color: "#475569",
    marginTop: 4,
    fontSize: 14,
  },

  info: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 13,
  },
});