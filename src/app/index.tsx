
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../data/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const iniciarSesion = async () => {
    const correo = email.trim().toLowerCase();

    if (!correo || !password) {
      Alert.alert(
        "Campos obligatorios",
        "Ingresa tu correo y contraseña."
      );
      return;
    }

    try {
      setCargando(true);

      const respuesta = await api.post("/usuarios/login", {
        email: correo,
        password: password,
      });

      // El backend confirmó que las credenciales son correctas.
      // Por ahora navegamos a la pantalla principal.
      console.log("Sesión iniciada:", respuesta.data.usuario.email);

      router.replace("/home");

    } catch (error: any) {
      console.log("ERROR AL INICIAR SESIÓN");
      console.log("Mensaje:", error.message);
      console.log("Código HTTP:", error.response?.status);
      console.log("Respuesta del servidor:", error.response?.data);

      if (error.response) {
        Alert.alert(
          `Error HTTP ${error.response.status}`,
          error.response.data?.error ||
          JSON.stringify(error.response.data)
        );
      } else {
        Alert.alert(
          "Error de conexión",
          `No se recibió respuesta del servidor: ${error.message}`
        );
      }
    } finally {
      setCargando(false);
    }
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
        autoCorrect={false}
        editable={!cargando}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        editable={!cargando}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={iniciarSesion}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            INICIAR SESIÓN
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
        disabled={cargando}
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
