import { View, Text, StyleSheet } from "react-native";

export function TableHeader() {
  return (
    <View style={styles.container}>
      <Text style={[styles.header, { flex: .5 }]}>Rank</Text>

      <Text style={[styles.header, { flex: 1.3 }]}>
        Component Code
      </Text>

      <Text style={[styles.header, { flex: 2.2 }]}>
        Description
      </Text>

      <Text style={[styles.header, { flex: 1 }]}>
        Global Consumption
      </Text>

      <Text style={[styles.header, { flex: 1.2 }]}>
        Price Trend
      </Text>

      <Text style={[styles.header, { flex: .9 }]}>
        Commercialization
      </Text>

      <Text style={[styles.header, { flex: .9 }]}>
        Verticalization
      </Text>

      <Text style={[styles.header, { flex: 1.2 }]}>
        Action
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
    backgroundColor: "#FAFAFA",
  },

  header: {
    fontSize: 12,
    color: "#8B8B8B",
    fontWeight: "700",
  },
});