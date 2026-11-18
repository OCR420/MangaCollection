
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [mostrarPassword, setMostrarPassword] = useState(false);

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

      const usuario = respuesta.data.usuario;

      // Guardar los datos del usuario
      await AsyncStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
      );

      // Comprobar si este usuario ya vio el tutorial
      const usuarioId = usuario._id || usuario.id || correo;

      const tutorialVisto = await AsyncStorage.getItem(
        `tutorialVisto_${usuarioId}`
      );

      console.log("Sesión iniciada:", usuario.email);

      // Decidir a dónde enviarlo
      if (tutorialVisto === "true") {
        router.replace("/home");
      } else {
        router.replace("/tutorial");
      }

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


      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarPassword}
          autoCapitalize="none"
          editable={!cargando}
        />

        <TouchableOpacity
          onPress={() => setMostrarPassword(!mostrarPassword)}
          disabled={cargando}
        >
          <Text style={styles.passwordToggle}>
            {mostrarPassword ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>


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

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#111"
  },
  passwordToggle: {
    color: "#333",
    fontWeight: "bold",
    paddingLeft: 10
  },
});
