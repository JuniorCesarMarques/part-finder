import { useHeaderConfig } from "@/contexts/HeaderContext";
import { useCallback, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { DefaultOpportunityInfoCard } from "@/components/OpportunityInfoCard";
import FiltersCard from "@/components/FiltersCard";
import { TopVerticalizationTable } from "@/components/TopVerticalizationTable";


function BackToHome() {
  return (
    <Pressable onPress={() => router.back()} style={styles.goBackElement}>
      <Ionicons name="arrow-back-outline" size={24} color="#2563EB" />
      <Text style={{ color: "#2563EB", fontWeight: "bold" }}>Back to home</Text>
    </Pressable>
  );
}

export default function Verticalization() {
  const { setHeaderConfig } = useHeaderConfig();

  useFocusEffect(
    useCallback(() => {
      setHeaderConfig({ left: <BackToHome /> });
    }, []),
  );

  useEffect(() => {
    setHeaderConfig({ left: <BackToHome /> });
  }, [setHeaderConfig]);

  return (
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              AI Verticalization Opportunity Finder
            </Text>
            <Text style={styles.description}>
              AI analyzes global data to identify components with the highest
              potential for vertical integration in our portfolio.
            </Text>
          </View>
          <Pressable style={styles.exportButton}>
            <Ionicons name="download-outline" size={16} color="#6D28D9" />
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
        </View>
        <DefaultOpportunityInfoCard />
        <FiltersCard />
        <TopVerticalizationTable />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  goBackElement: {
    gap: 5,
    alignItems: "center",
    flexDirection: "row",
  },

  headerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 10,
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  titleContainer: {
    width: 300,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  description: {
    marginTop: 6,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 15,
  },

  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#DDD6FE",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  exportText: {
    color: "#6D28D9",
    fontSize: 12,
    fontWeight: "600",
  },
});
