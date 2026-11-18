
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../components/BottomNav";
import { api } from "../data/api";

type Usuario = {
  _id?: string;
  id?: string;
  nombre?: string;
  email?: string;
};

type Volumen = {
  _id?: string;
  manga_id?: string | { _id?: string };
  numero_tomo?: number;
  estado?: "poseido" | "deseado";
};

export default function ProfileScreen() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mangas, setMangas] = useState(0);
  const [tomos, setTomos] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      setError("");

      // Recuperar el usuario guardado al iniciar sesión
      const usuarioGuardado = await AsyncStorage.getItem("usuario");

      if (!usuarioGuardado) {
        setError("No hay una sesión guardada. Inicia sesión nuevamente.");
        return;
      }

      const usuarioActual: Usuario = JSON.parse(usuarioGuardado);
      const usuarioId = usuarioActual._id || usuarioActual.id;

      if (!usuarioId) {
        setError("No se encontró el identificador del usuario.");
        return;
      }

      setUsuario(usuarioActual);

      // Consultar los volúmenes de este usuario en el backend
      const respuesta = await api.get(
        `/usuarios/${usuarioId}/volumenes`
      );

      const volumenes: Volumen[] = Array.isArray(respuesta.data)
        ? respuesta.data
        : Array.isArray(respuesta.data.volumenes)
          ? respuesta.data.volumenes
          : [];

      // Contar los mangas distintos registrados por el usuario
      const idsMangas = new Set(
        volumenes
          .map((volumen) => {
            if (typeof volumen.manga_id === "string") {
              return volumen.manga_id;
            }

            return volumen.manga_id?._id;
          })
          .filter(Boolean)
      );

      // Contar los tomos que el usuario posee
      const tomosPoseidos = volumenes.filter(
        (volumen) => volumen.estado === "poseido"
      ).length;

      // Calcular el porcentaje de tomos poseídos
      // respecto a los volúmenes registrados como poseídos o deseados
      const totalRegistrados = volumenes.length;

      const porcentaje =
        totalRegistrados > 0
          ? Math.round((tomosPoseidos / totalRegistrados) * 100)
          : 0;

      setMangas(idsMangas.size);
      setTomos(tomosPoseidos);
      setProgreso(porcentaje);
    } catch (err: any) {
      console.error("Error al cargar el perfil:", err);

      setError(
        err.response?.data?.mensaje ||
        "No se pudo cargar el perfil. Comprueba la conexión con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("usuario");
      router.replace("/");
    } catch {
      Alert.alert(
        "Error",
        "No se pudo cerrar la sesión correctamente."
      );
    }
  };

  const nombre = usuario?.nombre || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase() || "U";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>PERFIL</Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </View>

        {cargando ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#111111" />
            <Text style={styles.statusText}>
              Cargando perfil...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={cargarPerfil}
            >
              <Text style={styles.retryText}>Intentar de nuevo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* AVATAR */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{inicial}</Text>
              </View>
            </View>

            {/* NOMBRE */}
            <View style={styles.nameRow}>
              <Text style={styles.name}>{nombre}</Text>
            </View>

            {/* EMAIL */}
            <View style={styles.emailBox}>
              <Text style={styles.email}>
                {usuario?.email || "Correo no disponible"}
              </Text>
            </View>

            {/* DETALLES */}
            <Text style={styles.sectionTitle}>Detalles</Text>

            {/* MANGAS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>▣</Text>
              <Text style={styles.detailLabel}>Mangas:</Text>
              <Text style={styles.detailValue}>{mangas}</Text>
            </View>

            {/* TOMOS */}
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>▪</Text>
              <Text style={styles.detailLabel}>Tomos poseídos:</Text>
              <Text style={styles.detailValue}>{tomos}</Text>
            </View>

            {/* PROGRESO */}
            <View style={styles.detailCard}>
              <Text style={styles.detailIcon}>☆</Text>
              <Text style={styles.detailLabel}>
                Progreso registrado:
              </Text>
              <Text style={styles.detailValue}>{progreso}%</Text>
            </View>

            <Text style={styles.note}>
              El progreso compara los tomos poseídos con los tomos
              registrados como poseídos o deseados.
            </Text>
            <TouchableOpacity
              style={styles.tutorialButton}
              onPress={() => router.push("/tutorial?manual=1")}
            >
              <Text style={styles.tutorialButtonText}>
                Ver tutorial nuevamente
              </Text>
            </TouchableOpacity>
            {/* CERRAR SESIÓN */}
            <TouchableOpacity
              style={styles.logout}
              onPress={cerrarSesion}
            >
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingBottom: 100,
  },

  header: {
    height: 75,
    paddingHorizontal: 20,
    paddingTop: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    fontSize: 29,
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
  },

  logo: {
    width: 34,
    height: 34,
    borderRadius: 7,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  avatarContainer: {
    marginHorizontal: 20,
    height: 145,
    backgroundColor: "#CCCCCC",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E8E8E8",
    borderWidth: 2,
    borderColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#555555",
  },

  nameRow: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
  },

  emailBox: {
    minHeight: 38,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  email: {
    fontSize: 10,
    color: "#555555",
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "800",
  },

  detailCard: {
    minHeight: 58,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  detailIcon: {
    fontSize: 22,
    color: "#999999",
    width: 40,
  },

  detailLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
  },

  detailValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  note: {
    marginHorizontal: 20,
    marginBottom: 10,
    fontSize: 10,
    color: "#666666",
    lineHeight: 15,
  },

  statusContainer: {
    paddingHorizontal: 25,
    paddingVertical: 45,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    marginTop: 12,
    fontSize: 13,
    color: "#555555",
  },

  errorText: {
    fontSize: 13,
    color: "#B00020",
    textAlign: "center",
    lineHeight: 20,
  },

  retryButton: {
    marginTop: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#111111",
    borderRadius: 5,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  logout: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 40,
    backgroundColor: "#111111",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  tutorialButton: {
    marginHorizontal: 20,
    marginTop: 15,
    height: 42,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  tutorialButtonText: {
    color: "#111111",
    fontSize: 12,
    fontWeight: "700",
  },

});
