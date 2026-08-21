import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onPress?: () => void;
};

export default function VerticalizationCard({ onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && onPress && { opacity: 0.85 },
      ]}
      disabled={!onPress}
      onPress={onPress}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <MaterialCommunityIcons
            name="chart-timeline-variant"
            size={34}
            color="#6C3EF4"
          />
        </View>
        <View style={styles.center}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
            <Text style={styles.title}>
              AI Verticalization Opportunity Finder
            </Text>
          </View>
          <Text style={styles.description}>
            AI analyzes global data to identify components with the highest
            potential for vertical integration in our portfolio.
          </Text>
          <View style={styles.tags}>
            <View style={styles.tag}>
              <MaterialCommunityIcons name="earth" size={12} color="#5D5D5D" />
              <Text style={styles.tagText}>Global Consumption</Text>
            </View>
            <View style={styles.tag}>
              <MaterialIcons name="attach-money" size={12} color="#5D5D5D" />
              <Text style={styles.tagText}>Price & Cost Trend</Text>
            </View>
            <View style={styles.tag}>
              <MaterialCommunityIcons
                name="link-variant"
                size={12}
                color="#5D5D5D"
              />
              <Text style={styles.tagText}>Commercialization Potential</Text>
            </View>
            <View style={styles.tag}>
              <MaterialCommunityIcons
                name="factory"
                size={12}
                color="#5D5D5D"
              />
              <Text style={styles.tagText}>Verticalization Potential</Text>
            </View>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={26} color="#6C3EF4" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#D8C7FF",
    backgroundColor: "#F8F5FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 28,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  left: {
    marginRight: 12,
  },

  center: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  badge: {
    backgroundColor: "#6C3EF4",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },

  badgeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 9,
  },

  title: {
    flex: 1,
    color: "#5B2FCB",
    fontWeight: "700",
    fontSize: 14,
  },

  description: {
    color: "#666",
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 10,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
  },

  tagText: {
    marginLeft: 4,
    fontSize: 10,
    color: "#555",
  },
});
