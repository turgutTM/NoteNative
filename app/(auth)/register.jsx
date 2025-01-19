import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const Register = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [focusedInput, setFocusedInput] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleInputChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#1432f6", "#7a1616"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Create an Account</Text>
            <TextInput
              style={[
                styles.input,
                focusedInput === "username" && styles.inputFocused,
              ]}
              placeholder="Username"
              placeholderTextColor="#aaa"
              value={form.username}
              onChangeText={(value) => handleInputChange("username", value)}
              onFocus={() => setFocusedInput("username")}
              onBlur={() => setFocusedInput(null)}
            />
            <TextInput
              style={[
                styles.input,
                focusedInput === "email" && styles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => handleInputChange("email", value)}
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
            <TextInput
              style={[
                styles.input,
                focusedInput === "password" && styles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={form.password}
              onChangeText={(value) => handleInputChange("password", value)}
              onFocus={() => setFocusedInput("password")}
              onBlur={() => setFocusedInput(null)}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={submit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={styles.signUpText}
                onPress={() => router.push("/login")}
              >
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Register;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  content: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "gray",
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#fff",
  },
  inputFocused: {
    borderBottomColor: "white",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1432f6",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  signUpText: {
    marginTop: 20,
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
