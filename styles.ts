import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECECEC",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 3,
    margin: 15
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 18,
  },

  tableContainer: {
    minWidth: 700,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2B2B2B",
  },

  badge: {
    backgroundColor: "#EEF2FF",
    borderRadius: 30,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  badgeText: {
    color: "#5B3DF5",
    fontWeight: "700",
    fontSize: 12,
  },
});
