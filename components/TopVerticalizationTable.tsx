import { ScrollView, Text, View } from "react-native";

import { opportunities } from "@/mock";
import { styles } from "@/styles";

import { TableHeader } from "@/components/TableHeader";
import { TableRow } from "@/components/TableRow";

export function TopVerticalizationTable() {
  return (
    <View style={styles.card}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={styles.tableContainer}>
          <View style={styles.topBar}>
            <Text style={styles.title}>
              Top Verticalization Opportunities
            </Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>5 results</Text>
            </View>
          </View>

          <TableHeader />

          {opportunities.map((item) => (
            <TableRow
              key={item.componentCode}
              rank={item.rank}
              componentCode={item.componentCode}
              description={item.description}
              globalConsumption={item.globalConsumption}
              priceTrend={item.priceTrend}
              commercialization={item.commercialization}
              verticalization={item.verticalization}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}