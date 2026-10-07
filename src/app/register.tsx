import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

export default function RegisterScreen() {
  const crearCuenta = () => {
    router.replace("/home");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>MANGA</Text>
      <Text style={styles.logoSub}>COLLECTION</Text>

      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={crearCuenta}
      >
        <Text style={styles.buttonText}>
          CREAR CUENTA
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.back()}
      >
        <Text style={styles.back}>
          ¿Ya tienes una cuenta? Iniciar sesión
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
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    color: "#111111",
  },

  logoSub: {
    fontSize: 13,
    letterSpacing: 5,
    textAlign: "center",
    marginBottom: 35,
    color: "#555555",
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
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
    marginTop: 5,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  back: {
    textAlign: "center",
    marginTop: 25,
    color: "#444444",
  },
});