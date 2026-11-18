
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BottomNav from "../components/BottomNav";
import { api } from "../data/api";

type Manga = {
  _id: string;
  mal_id?: number;
  titulo: string;
  imagen_url?: string;
};

type Volumen = {
  _id: string;
  manga_id: Manga | string;
  numero_tomo: number;
  estado: "poseido" | "deseado";
  precio_estimado?: number;
};

export default function WishlistScreen() {
  const [items, setItems] = useState<Volumen[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarDeseos = useCallback(async () => {
    try {
      setCargando(true);

      const usuarioTexto = await AsyncStorage.getItem("usuario");

      if (!usuarioTexto) {
        setItems([]);
        router.replace("/");
        return;
      }

      const usuario = JSON.parse(usuarioTexto);
      const respuesta = await api.get(
        `/usuarios/${usuario._id}/volumenes`
      );

      const deseos: Volumen[] = respuesta.data.filter(
        (volumen: Volumen) => volumen.estado === "deseado"
      );

      setItems(deseos);

      // Al actualizar la pantalla, seleccionar por defecto todos los deseos.
      setSeleccionados(deseos.map((volumen) => volumen._id));
    } catch (error: any) {
      console.error(
        "Error al cargar la lista de deseos:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "No se pudo cargar tu lista de deseos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDeseos();
    }, [cargarDeseos])
  );

  function cambiarSeleccion(id: string) {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((itemId) => itemId !== id)
        : [...actuales, id]
    );
  }

  const itemsFiltrados = items.filter((item) => {
    const manga = item.manga_id;
    const titulo =
      typeof manga === "string" ? "" : manga?.titulo || "";

    return (
      titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      String(item.numero_tomo).includes(busqueda)
    );
  });

  const presupuesto = items
    .filter((item) => seleccionados.includes(item._id))
    .reduce((total, item) => total + (Number(item.precio_estimado) || 0), 0);

  const cantidadSeleccionada = items.filter((item) =>
    seleccionados.includes(item._id)
  ).length;

  async function eliminarDeseo(item: Volumen) {
    Alert.alert(
      "Quitar de la lista",
      "¿Quieres eliminar este tomo de tu lista de deseos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/volumenes/${item._id}`);
              setItems((actuales) =>
                actuales.filter((volumen) => volumen._id !== item._id)
              );
              setSeleccionados((actuales) =>
                actuales.filter((id) => id !== item._id)
              );
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el tomo.");
            }
          }
        }
      ]
    );
  }


  async function eliminarMangaCompleto(item: Volumen) {
    const manga = item.manga_id;

    if (typeof manga === "string" || !manga?._id) {
      Alert.alert("Error", "No se pudo identificar el manga.");
      return;
    }

    Alert.alert(
      "Eliminar manga de deseos",
      `¿Quieres quitar todos los tomos de "${manga.titulo}" de tu lista de deseos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todos",
          style: "destructive",
          onPress: async () => {
            try {
              const usuarioTexto = await AsyncStorage.getItem("usuario");

              if (!usuarioTexto) {
                router.replace("/");
                return;
              }

              const usuario = JSON.parse(usuarioTexto);

              await api.delete(
                `/usuarios/${usuario._id}/mangas/${manga._id}`,
                { params: { estado: "deseado" } }
              );

              // Quitar de la pantalla todos los tomos de ese manga.
              setItems((actuales) =>
                actuales.filter((volumen) => {
                  const mangaVolumen = volumen.manga_id;

                  return (
                    typeof mangaVolumen === "string" ||
                    mangaVolumen._id !== manga._id
                  );
                })
              );

              // Actualizar también los elementos seleccionados.
              setSeleccionados((actuales) =>
                actuales.filter((id) =>
                  items.every((volumen) => {
                    const mangaVolumen = volumen.manga_id;

                    return (
                      volumen._id !== id ||
                      typeof mangaVolumen === "string" ||
                      mangaVolumen._id !== manga._id
                    );
                  })
                )
              );

              Alert.alert(
                "Listo",
                "Se eliminaron todos los tomos de ese manga de tu lista de deseos."
              );
            } catch (error: any) {
              console.error(
                "Error al eliminar manga de deseos:",
                error.response?.data || error.message
              );
              Alert.alert("Error", "No se pudo eliminar el manga.");
            }
          }
        }
      ]
    );
  }


  function abrirManga(item: Volumen) {
    const manga = item.manga_id;

    if (typeof manga !== "string" && manga?.mal_id) {
      router.push(`/manga/${manga.mal_id}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <View style={styles.pantalla}>
      <ScrollView
        style={styles.contenedor}
        contentContainerStyle={styles.contenido}
      >
        <Text style={styles.marca}>MANGA COLLECTION</Text>
        <Text style={styles.titulo}>LISTA DE DESEOS</Text>
        <Text style={styles.descripcion}>
          Organiza los tomos que quieres comprar.
        </Text>

        <View style={styles.resumen}>
          <Text style={styles.resumenEtiqueta}>PRESUPUESTO SELECCIONADO</Text>
          <Text style={styles.presupuesto}>
            ${presupuesto.toLocaleString("es-CO")}
          </Text>
          <Text style={styles.resumenDetalle}>
            {cantidadSeleccionada} de {items.length} tomos seleccionados
          </Text>
        </View>

        <TextInput
          style={styles.busqueda}
          placeholder="Busca por manga o número de tomo..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <TouchableOpacity
          style={styles.actualizar}
          onPress={cargarDeseos}
        >
          <Text style={styles.actualizarTexto}>Actualizar lista</Text>
        </TouchableOpacity>

        {cargando ? (
          <ActivityIndicator size="large" color="#111" style={styles.carga} />
        ) : itemsFiltrados.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioTitulo}>
              {busqueda ? "No hay resultados" : "Tu lista está vacía"}
            </Text>
            <Text style={styles.vacioTexto}>
              {busqueda
                ? "Prueba con otro título o número de tomo."
                : "Entra a la ficha de un manga y agrega tomos a tu lista de deseos."}
            </Text>
            {!busqueda && (
              <TouchableOpacity
                style={styles.boton}
                onPress={() => router.push("/search")}
              >
                <Text style={styles.textoBoton}>Buscar mangas</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          itemsFiltrados.map((item) => {
            const manga = item.manga_id;
            const titulo =
              typeof manga === "string"
                ? "Manga"
                : manga?.titulo || "Manga";
            const seleccionado = seleccionados.includes(item._id);
            const precio = Number(item.precio_estimado) || 0;

            return (
              <View key={item._id} style={styles.tarjeta}>
                <TouchableOpacity
                  style={styles.seleccion}
                  onPress={() => cambiarSeleccion(item._id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      seleccionado && styles.checkboxActivo
                    ]}
                  >
                    {seleccionado && (
                      <Text style={styles.checkTexto}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detalle}
                  onPress={() => abrirManga(item)}
                >
                  <Text style={styles.nombreManga}>{titulo}</Text>
                  <Text style={styles.tomo}>Tomo {item.numero_tomo}</Text>
                  <Text style={styles.precio}>
                    Precio estimado: ${precio.toLocaleString("es-CO")}
                  </Text>

                  <TouchableOpacity
                    style={styles.eliminarManga}
                    onPress={() => eliminarMangaCompleto(item)}
                  >
                    <Text style={styles.eliminarMangaTexto}>
                      Eliminar todos los tomos de este manga
                    </Text>
                  </TouchableOpacity>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.eliminar}
                  onPress={() => eliminarDeseo(item)}
                >
                  <Text style={styles.eliminarTexto}>Quitar</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      <BottomNav active="wishlist" />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: "#fff" },
  contenedor: { flex: 1 },
  contenido: { padding: 20, paddingBottom: 30 },
  marca: { fontSize: 12, fontWeight: "bold", letterSpacing: 2, color: "#555" },
  titulo: { fontSize: 27, fontWeight: "bold", marginTop: 15, color: "#111" },
  descripcion: { color: "#666", marginTop: 7, marginBottom: 20 },
  resumen: {
    padding: 18,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    marginBottom: 18
  },
  resumenEtiqueta: { fontSize: 11, color: "#555", letterSpacing: 1 },
  presupuesto: { fontSize: 28, fontWeight: "bold", color: "#111", marginTop: 8 },
  resumenDetalle: { fontSize: 12, color: "#666", marginTop: 5 },
  busqueda: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "#111"
  },
  actualizar: { alignSelf: "flex-end", paddingVertical: 12 },
  actualizarTexto: { color: "#444", fontSize: 13 },
  carga: { marginTop: 40 },
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12
  },
  seleccion: { paddingRight: 12 },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  eliminarManga: {
    marginTop: 8,
    paddingVertical: 6
  },
  eliminarMangaTexto: {
    color: "#b42318",
    fontSize: 11,
    fontWeight: "bold"
  },

  checkboxActivo: { backgroundColor: "#111", borderColor: "#111" },
  checkTexto: { color: "#fff", fontWeight: "bold" },
  detalle: { flex: 1 },
  nombreManga: { fontSize: 15, fontWeight: "bold", color: "#111" },
  tomo: { fontSize: 13, color: "#555", marginTop: 5 },
  precio: { fontSize: 12, color: "#666", marginTop: 5 },
  eliminar: { padding: 6, marginLeft: 4 },
  eliminarTexto: { color: "#777", fontSize: 12 },
  vacio: { alignItems: "center", paddingVertical: 40 },
  vacioTitulo: { fontSize: 18, fontWeight: "bold", color: "#111" },
  vacioTexto: { color: "#666", textAlign: "center", marginTop: 10, lineHeight: 21 },
  boton: { backgroundColor: "#111", padding: 13, borderRadius: 8, marginTop: 18 },
  textoBoton: { color: "#fff", fontWeight: "bold" },

});
