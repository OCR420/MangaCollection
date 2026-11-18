import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../data/api";

export default function RegisterScreen() {
  // 1. Los hooks (useState) deben ir al nivel principal del componente
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Opcional, para validar
  const [cargando, setCargando] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  // 2. La función principal fuera del renderizado

  const crearCuenta = async () => {
    if (!nombre.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Campos incompletos", "Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Contraseñas diferentes", "Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const respuesta = await api.post("/usuarios", {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      console.log("Registro:", respuesta.status, respuesta.data);

      Alert.alert(
        "Registro exitoso",
        "Tu cuenta se ha creado correctamente.",
        [
          {
            text: "Aceptar",
            onPress: () => router.replace("/"),
          },
        ]
      );
    } catch (error: any) {
      console.log("Error al registrar:", error.message);
      console.log("Estado HTTP:", error.response?.status);
      console.log("Respuesta del servidor:", error.response?.data);

      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        (error.response
          ? `El servidor respondió con el código ${error.response.status}.`
          : "No hay conexión con el servidor. Verifica la IP y la red.");

      Alert.alert("Error de registro", mensaje);
    } finally {
      setCargando(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MANGA</Text>
      <Text style={styles.logoSub}>COLLECTION</Text>

      <Text style={styles.title}>Crear cuenta</Text>

      {/* 3. Conectamos los TextInput con su respectivo value y onChangeText */}
      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />


      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          secureTextEntry={!mostrarPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => setMostrarPassword(!mostrarPassword)}
        >
          <Text style={styles.passwordToggle}>
            {mostrarPassword ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>



      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirmar contraseña"
          secureTextEntry={!mostrarConfirmacion}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          onPress={() => setMostrarConfirmacion(!mostrarConfirmacion)}
        >
          <Text style={styles.passwordToggle}>
            {mostrarConfirmacion ? "Ocultar" : "Ver"}
          </Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity
        style={styles.button}
        onPress={crearCuenta}
        disabled={cargando}
      >
        <Text style={styles.buttonText}>
          {cargando ? "CREANDO..." : "CREAR CUENTA"}
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