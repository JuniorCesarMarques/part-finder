import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type EvaluationItem = {
  title: string;
  weight: number;
  icon: React.ReactNode;
};

type Props = {
  description: string;
  criteria: EvaluationItem[];
};

export default function OpportunityInfoCard({
  description,
  criteria,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={20}
              color="#7C3AED"
            />
          </View>

          <Text style={styles.title}>
            How it works
          </Text>
        </View>

        <Text style={styles.description}>
          {description}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.criteriaContainer}>
        <Text style={styles.criteriaTitle}>
          Evaluation Criteria
        </Text>

        <View style={styles.criteriaRow}>
          {criteria.map((item, index) => (
            <View key={index} style={styles.criterion}>
              {item.icon}

              <Text style={styles.criterionTitle}>
                {item.title}
              </Text>

              <Text style={styles.weight}>
                {item.weight}%
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export function DefaultOpportunityInfoCard() {
  return (
    <OpportunityInfoCard
      description="Our AI analyzes global consumption, price & cost trends, and commercialization potential to recommend components that offer the greatest strategic value for vertical integration."
      criteria={[
        {
          title: "Global\nConsumption",
          weight: 12,
          icon: (
            <Ionicons
              name="globe-outline"
              size={22}
              color="#2563EB"
            />
          ),
        },
        {
          title: "Price & Cost\nTrend",
          weight: 12,
          icon: (
            <Feather
              name="trending-up"
              size={22}
              color="#2563EB"
            />
          ),
        },
        {
          title: "Commercialization\nPotential",
          weight: 12,
          icon: (
            <MaterialCommunityIcons
              name="target"
              size={22}
              color="#2563EB"
            />
          ),
        },
        {
          title: "Verticalization\nFeasibility",
          weight: 12,
          icon: (
            <MaterialCommunityIcons
              name="factory"
              size={22}
              color="#2563EB"
            />
          ),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",

    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9D5FF",

    padding: 20,

    marginHorizontal: 16,
    marginTop: 18,
  },

  header: {
    alignItems: "center",
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 12,
  },

  iconContainer: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: "#F5F3FF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",

    color: "#5B21B6",
  },

  description: {
    maxWidth: 500,

    textAlign: "center",

    fontSize: 13,
    lineHeight: 19,

    color: "#6B7280",
  },

  divider: {
    height: 1,

    backgroundColor: "#F3F4F6",

    marginVertical: 20,
  },

  criteriaContainer: {
    alignItems: "center",
  },

  criteriaTitle: {
    fontSize: 14,
    fontWeight: "700",

    color: "#374151",

    marginBottom: 18,
  },

  criteriaRow: {
    width: "100%",

    flexDirection: "row",
  },

  criterion: {
    flex: 1,

    alignItems: "center",

    paddingHorizontal: 8,
  },

  criterionTitle: {
    marginTop: 10,

    textAlign: "center",

    fontSize: 11,
    lineHeight: 15,

    fontWeight: "600",

    color: "#374151",
  },

  weight: {
    marginTop: 5,

    fontSize: 11,

    color: "#9CA3AF",
  },
});