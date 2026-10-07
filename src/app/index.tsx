import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>MANGA</Text>
      <Text style={styles.logoSub}>COLLECTION</Text>

      <Text style={styles.title}>Iniciar sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={iniciarSesion}
      >
        <Text style={styles.buttonText}>
          INICIAR SESIÓN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.register}>
          ¿No tienes una cuenta? Registrarse
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 30,
  },

  logo: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    color: "#111111",
  },

  logoSub: {
    fontSize: 14,
    letterSpacing: 5,
    textAlign: "center",
    marginBottom: 50,
    color: "#555555",
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 25,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  register: {
    textAlign: "center",
    marginTop: 25,
    color: "#444444",
  },
});