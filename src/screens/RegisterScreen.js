import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function RegisterScreen({ navigation }) {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Home")}
      >
        <Text style={styles.buttonText}>
          CREAR CUENTA
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.back}>
          Ya tengo una cuenta
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFFFFF"
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 30
  },

  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15
  },

  button: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 10,
    alignItems: "center"
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },

  back: {
    textAlign: "center",
    marginTop: 25
  }
});