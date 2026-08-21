import { Part, PartWithCount } from "@/types";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

type Inputs = Part;

type RegisterPartModalProps = {
  onsubmit: SubmitHandler<Part>;
  selectedPart: PartWithCount | undefined;
};

export default function PartFormFields({
  onsubmit,
  selectedPart,
}: RegisterPartModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ]);


  console.log("Render")
  return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {selectedPart ? "Edit Part" : "Create Part"}
        </Text>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.formContainer}
          >
            <View style={styles.form}>
              <Text style={styles.label}>Part Number</Text>
              <Controller
                control={control}
                defaultValue={selectedPart?.partNumber}
                rules={{ required: "Part Number is required" }}
                name="partNumber"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Ex: PN-001245"
                    placeholderTextColor="#94a3b8"
                  />
                )}
              />
              {errors.partNumber && (
                <Text style={styles.error}>{errors.partNumber.message}</Text>
              )}
              <Text style={styles.label}>Description</Text>
              <Controller
                control={control}
                defaultValue={selectedPart?.description}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Component description"
                    placeholderTextColor="#94a3b8"
                  />
                )}
              />
              {errors.description && (
                <Text style={styles.error}>{errors.description?.message}</Text>
              )}
              <Text style={styles.label}>Supplier</Text>
              <Controller
                control={control}
                defaultValue={selectedPart?.supplier}
                name="supplier"
                rules={{ required: "Supplier is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Supplier"
                    placeholderTextColor="#94a3b8"
                  />
                )}
              />
              {errors.supplier && (
                <Text style={styles.error}>{errors.supplier?.message}</Text>
              )}
              <Text style={styles.label}>Risk</Text>
              <Controller
                control={control}
                defaultValue={selectedPart?.risk}
                name="risk"
                rules={{ required: "Risk is required" }}
                render={({ field: { onChange, value } }) => (
                  <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                      open={open}
                      value={value}
                      items={items}
                      setOpen={setOpen}
                      setValue={(callback) => {
                        const val = callback(value);
                        onChange(val);
                        return val;
                      }}
                      setItems={setItems}
                      placeholder="Select risk level"
                      style={styles.dropdown}
                      dropDownContainerStyle={styles.dropdownContainer}
                      textStyle={{ color: "black" }}
                      placeholderStyle={{ color: "#94a3b8" }}
                      listMode="SCROLLVIEW"
                    />
                    {errors.risk && (
                      <Text style={styles.error}>{errors.risk.message}</Text>
                    )}
                  </View>
                )}
              />
              <Text style={styles.label}>Family</Text>
              <Controller
                control={control}
                defaultValue={selectedPart?.family}
                name="family"
                rules={{ required: "Family is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChange}
                    placeholder="Family"
                    placeholderTextColor="#94a3b8"
                  />
                )}
              />
              {errors.family && (
                <Text style={styles.error}>{errors.family.message}</Text>
              )}
              <Pressable style={styles.button} onPress={handleSubmit(onsubmit)}>
                <Text style={styles.buttonText}>
                  {selectedPart ? "Edit Part" : "Create Part"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    padding: 20,
  },

  formContainer: {
    paddingBottom: 20,
  },

  form: {
    gap: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },

  label: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#0F172A",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  error: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: -6,
  },

  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  dropdownWrapper: {
    zIndex: 1000,
    elevation: 1000,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderRadius: 12,
  },

  dropdownContainer: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
  },
});
