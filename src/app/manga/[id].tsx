
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { api } from "../../data/api";

const TENRAI_URL = "https://api.tenrai.org/v1";

type MangaDetalle = {
  mal_id: number;
  title?: string;
  title_english?: string;
  images?: { jpg?: { image_url?: string } };
  genres?: { name: string }[];
  authors?: { name: string }[];
  volumes?: number | null;
  status?: string;
  synopsis?: string;
  score?: number;
  published?: { string?: string };
};

export default function MangaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [manga, setManga] = useState<MangaDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [numeroTomo, setNumeroTomo] = useState("1");
  const [precio, setPrecio] = useState("40000");

  async function cargarManga() {
    try {
      setCargando(true);
      const respuesta = await axios.get(`${TENRAI_URL}/manga/${id}/full`);
      const datos = respuesta.data?.data ?? respuesta.data;
      setManga(datos);
    } catch (error) {
      console.error("Error al cargar manga:", error);
      Alert.alert("Error", "No se pudo cargar la información del manga.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (id) cargarManga();
  }, [id]);

  async function agregarTomo(estado: "poseido" | "deseado") {
    if (!manga) return;

    const tomo = Number(numeroTomo);

    if (!Number.isInteger(tomo) || tomo < 1) {
      Alert.alert("Tomo inválido", "Escribe un número de tomo válido.");
      return;
    }

    if (manga.volumes && tomo > manga.volumes) {
      Alert.alert(
        "Número de tomo",
        `Este manga tiene registrados ${manga.volumes} tomos.`
      );
      return;
    }

    try {
      setGuardando(true);

      const usuarioTexto = await AsyncStorage.getItem("usuario");

      if (!usuarioTexto) {
        Alert.alert("Sesión requerida", "Inicia sesión para guardar tomos.");
        router.replace("/");
        return;
      }

      const usuario = JSON.parse(usuarioTexto);

      // Crear o recuperar el registro del manga en nuestra base de datos.
      const respuestaManga = await api.post("/mangas", {
        mal_id: Number(manga.mal_id || id),
        titulo: manga.title || manga.title_english || "Manga sin título",
        autor: manga.authors?.map((autor) => autor.name).join(", "),
        total_tomos: manga.volumes || 1,
        estado_publicacion:
          manga.status?.toLowerCase().includes("publishing")
            ? "en_emision"
            : "finalizada",
        imagen_url: manga.images?.jpg?.image_url
      });

      const mangaGuardado = respuestaManga.data;

      // Revisar si el usuario ya tiene registrado ese tomo.
      const respuestaVolumenes = await api.get(
        `/usuarios/${usuario._id}/volumenes`
      );

      const volumenExistente = respuestaVolumenes.data.find(
        (volumen: any) =>
          String(volumen.manga_id?._id || volumen.manga_id) ===
            String(mangaGuardado._id) &&
          Number(volumen.numero_tomo) === tomo
      );

      if (volumenExistente) {
        await api.put(`/volumenes/${volumenExistente._id}`, {
          estado,
          precio_estimado:
            estado === "deseado" && precio.trim() !== ""
              ? Number(precio)
              : undefined
        });
      } else {
        const precioNumero = Number(precio);

        await api.post("/volumenes", {
          usuario_id: usuario._id,
          manga_id: mangaGuardado._id,
          numero_tomo: tomo,
          estado,
          ...(estado === "deseado" && precio.trim() !== "" &&
          Number.isFinite(precioNumero) && precioNumero >= 0
            ? { precio_estimado: precioNumero }
            : {})
        });
      }

      Alert.alert(
        "Guardado",
        estado === "poseido"
          ? "El tomo se agregó a Mi colección."
          : "El tomo se agregó a tu lista de deseos.",
        [
          { text: "Ver mi colección", onPress: () => router.replace("/home") },
          {
            text: "Ver deseos",
            onPress: () => router.replace("/wishlist")
          },
          { text: "Seguir aquí", style: "cancel" }
        ]
      );
    } catch (error: any) {
      console.error(
        "Error al guardar el tomo:",
        error.response?.data || error.message
      );
      Alert.alert(
        "No se pudo guardar",
        error.response?.data?.error ||
          "Revisa la conexión con el servidor e inténtalo de nuevo."
      );
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.textoSecundario}>Cargando manga...</Text>
      </View>
    );
  }

  if (!manga) {
    return (
      <View style={styles.centrado}>
        <Text>No se encontró la información del manga.</Text>
        <TouchableOpacity style={styles.boton} onPress={cargarManga}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.volver}>‹ Volver</Text>
      </TouchableOpacity>

      {manga.images?.jpg?.image_url ? (
        <Image
          source={{ uri: manga.images.jpg.image_url }}
          style={styles.portada}
          resizeMode="contain"
        />
      ) : null}

      <Text style={styles.titulo}>
        {manga.title || manga.title_english || "Manga sin título"}
      </Text>

      <Text style={styles.dato}>
        Autor: {manga.authors?.map((autor) => autor.name).join(", ") || "No disponible"}
      </Text>
      <Text style={styles.dato}>Estado: {manga.status || "No disponible"}</Text>
      <Text style={styles.dato}>
        Tomos registrados: {manga.volumes ?? "No disponible"}
      </Text>
      <Text style={styles.dato}>
        Puntuación: {manga.score ?? "Sin puntuación"}
      </Text>
      <Text style={styles.dato}>
        Géneros: {manga.genres?.map((genero) => genero.name).join(", ") || "No disponibles"}
      </Text>

      <Text style={styles.subtitulo}>Sinopsis</Text>
      <Text style={styles.sinopsis}>
        {manga.synopsis || "No hay una sinopsis disponible."}
      </Text>

      <Text style={styles.subtitulo}>Agregar un tomo</Text>
      <Text style={styles.etiqueta}>Número del tomo</Text>
      <TextInput
        style={styles.input}
        value={numeroTomo}
        onChangeText={setNumeroTomo}
        keyboardType="number-pad"
        placeholder="Ej. 1"
      />

      <Text style={styles.etiqueta}>Precio estimado (solo lista de deseos)</Text>
      <TextInput
        style={styles.input}
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
        placeholder="Ej. 40000"
      />

      <TouchableOpacity
        style={styles.boton}
        disabled={guardando}
        onPress={() => agregarTomo("poseido")}
      >
        <Text style={styles.textoBoton}>
          {guardando ? "Guardando..." : "Agregar a mi colección"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonSecundario}
        disabled={guardando}
        onPress={() => agregarTomo("deseado")}
      >
        <Text style={styles.textoBotonSecundario}>
          Agregar a lista de deseos
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "#fff", padding: 20 },
  centrado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff"
  },
  volver: { fontSize: 17, marginBottom: 20, color: "#111" },
  portada: { width: 180, height: 250, alignSelf: "center", marginBottom: 20 },
  titulo: { fontSize: 25, fontWeight: "bold", marginBottom: 12, color: "#111" },
  dato: { fontSize: 14, color: "#444", marginBottom: 7 },
  subtitulo: { fontSize: 19, fontWeight: "bold", marginTop: 22, marginBottom: 10 },
  sinopsis: { fontSize: 15, lineHeight: 22, color: "#333" },
  etiqueta: { fontSize: 14, marginTop: 10, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: "#111"
  },
  boton: {
    backgroundColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 12
  },
  textoBoton: { color: "#fff", fontWeight: "bold" },
  botonSecundario: {
    borderWidth: 1,
    borderColor: "#111",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30
  },
  textoBotonSecundario: { color: "#111", fontWeight: "bold" },
  textoSecundario: { marginTop: 10, color: "#555" }
});
