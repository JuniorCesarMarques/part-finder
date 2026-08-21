import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onApply?: () => void;
};

export default function FiltersCard({ onApply }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Filters
      </Text>

      <View style={styles.row}>
        <FilterField
          label="Component Code"
          placeholder="e.g. 78233-4532"
        />

        <FilterField
          label="Component Category"
          placeholder="All Categories"
          dropdown
        />

        <FilterField
          label="Plant / Region"
          placeholder="All Regions"
          dropdown
        />

        <FilterField
          label="Time Range"
          placeholder="Last 12 Months"
          dropdown
        />

        <TouchableOpacity
          style={styles.button}
          onPress={onApply}
        >
          <Ionicons
            name="funnel-outline"
            size={14}
            color="#FFF"
          />

          <Text style={styles.buttonText}>
            Apply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


function FilterField({
  label,
  placeholder,
  dropdown,
}: {
  label: string;
  placeholder: string;
  dropdown?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
        />

        {dropdown && (
          <Ionicons
            name="chevron-down"
            size={14}
            color="#6B7280"
          />
        )}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",

    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    padding: 14,

    marginHorizontal: 16,
    marginTop: 18,
  },

  title: {
    fontSize: 12,
    fontWeight: "700",

    color: "#5B21B6",

    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,

    alignItems: "flex-end",
  },

  field: {
    flex: 1,

    minWidth: 130,
  },

  label: {
    fontSize: 10,
    fontWeight: "600",

    color: "#374151",

    marginBottom: 5,
  },

  inputContainer: {
    height: 32,

    borderWidth: 1,
    borderColor: "#D1D5DB",

    borderRadius: 5,

    paddingHorizontal: 8,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFF",
  },

  input: {
    flex: 1,

    fontSize: 11,

    padding: 0,

    color: "#374151",
  },

  button: {
    height: 32,

    minWidth: 70,

    paddingHorizontal: 14,

    borderRadius: 5,

    backgroundColor: "#6D28D9",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 6,
  },

  buttonText: {
    fontSize: 11,

    fontWeight: "700",

    color: "#FFF",
  },
});