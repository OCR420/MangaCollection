
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import BottomNav from "../components/BottomNav";

const TENRAI_URL = "https://api.tenrai.org/v1";
const CLAVE_RECIENTES = "mangas_vistos_recientemente";

type Manga = {
  mal_id: number;
  title: string;
  title_english?: string | null;
  images?: {
    jpg?: {
      image_url?: string;
      large_image_url?: string;
    };
  };
  status?: string;
  score?: number | null;
  chapters?: number | null;
  authors?: { name: string }[];
};

type Categoria = "populares" | "emision" | "recientes";

export default function SearchScreen() {
  const [populares, setPopulares] = useState<Manga[]>([]);
  const [emision, setEmision] = useState<Manga[]>([]);
  const [recientes, setRecientes] = useState<Manga[]>([]);
  const [resultados, setResultados] = useState<Manga[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [error, setError] = useState("");
  const [errorBusqueda, setErrorBusqueda] = useState("");

  const [categoriaExpandida, setCategoriaExpandida] =
    useState<Categoria | null>(null);

  const [modoBusqueda, setModoBusqueda] = useState(false);

  useEffect(() => {
    cargarCategorias();
    cargarRecientes();
  }, []);

  // Obtener mangas populares y mangas en publicación
  const cargarCategorias = async () => {
    try {
      setCargandoCategorias(true);
      setError("");

      const [respuestaPopulares, respuestaEmision] =
        await Promise.all([
          axios.get(`${TENRAI_URL}/top/manga`, {
            params: {
              filter: "bypopularity",
              limit: 12,
            },
            timeout: 15000,
          }),
          axios.get(`${TENRAI_URL}/top/manga`, {
            params: {
              filter: "publishing",
              limit: 12,
            },
            timeout: 15000,
          }),
        ]);

      setPopulares(respuestaPopulares.data.data || []);
      setEmision(respuestaEmision.data.data || []);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError(
        "No se pudieron cargar los mangas. Revisa tu conexión e inténtalo de nuevo."
      );
    } finally {
      setCargandoCategorias(false);
    }
  };

  // Recuperar el historial guardado en el dispositivo
  const cargarRecientes = async () => {
    try {
      const guardados = await AsyncStorage.getItem(CLAVE_RECIENTES);

      if (guardados) {
        setRecientes(JSON.parse(guardados));
      }
    } catch (err) {
      console.error("Error al cargar el historial:", err);
    }
  };

  // Buscar mangas por título en Jikan
  const buscarMangas = async () => {
    const texto = busqueda.trim();

    if (!texto) {
      setModoBusqueda(false);
      setResultados([]);
      setErrorBusqueda("");
      Keyboard.dismiss();
      return;
    }

    try {
      Keyboard.dismiss();
      setBuscando(true);
      setModoBusqueda(true);
      setErrorBusqueda("");
      setCategoriaExpandida(null);

      const respuesta = await axios.get(`${TENRAI_URL}/manga`, {
        params: {
          q: texto,
          limit: 20,
          sfw: true,
        },
        timeout: 15000,
      });

      setResultados(respuesta.data.data || []);

      if (!respuesta.data.data?.length) {
        setErrorBusqueda("No se encontraron mangas con ese nombre.");
      }
    } catch (err) {
      console.error("Error al buscar mangas:", err);
      setResultados([]);
      setErrorBusqueda(
        "No se pudo realizar la búsqueda. Inténtalo de nuevo en unos segundos."
      );
    } finally {
      setBuscando(false);
    }
  };

  // Guardar un manga cuando el usuario abre su detalle
  const abrirManga = async (manga: Manga) => {
    try {
      const guardados = await AsyncStorage.getItem(CLAVE_RECIENTES);
      const listaAnterior: Manga[] = guardados
        ? JSON.parse(guardados)
        : [];

      const listaActualizada = [
        manga,
        ...listaAnterior.filter(
          (item) => item.mal_id !== manga.mal_id
        ),
      ].slice(0, 20);

      await AsyncStorage.setItem(
        CLAVE_RECIENTES,
        JSON.stringify(listaActualizada)
      );

      setRecientes(listaActualizada);
    } catch (err) {
      console.error("Error al guardar el historial:", err);
    }

    // Requiere que exista la ruta de detalle correspondiente
    router.push(`/manga/${manga.mal_id}`);
  };

  const obtenerCategoria = (categoria: Categoria): Manga[] => {
    switch (categoria) {
      case "populares":
        return populares;
      case "emision":
        return emision;
      case "recientes":
        return recientes;
    }
  };

  const renderManga = (manga: Manga) => {
    const portada = manga.images?.jpg?.image_url;
    const titulo = manga.title_english || manga.title;

    return (
      <TouchableOpacity
        key={manga.mal_id}
        style={styles.manga}
        onPress={() => abrirManga(manga)}
        activeOpacity={0.75}
      >
        <View style={styles.cover}>
          {portada ? (
            <Image
              source={{ uri: portada }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.coverText}>{titulo}</Text>
          )}
        </View>

        <Text style={styles.mangaTitle} numberOfLines={2}>
          {titulo}
        </Text>

        {manga.score != null && (
          <Text style={styles.score}>★ {manga.score}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderCategoria = (
    titulo: string,
    categoria: Categoria
  ) => {
    const lista = obtenerCategoria(categoria);
    const expandida = categoriaExpandida === categoria;

    return (
      <View key={categoria}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{titulo}</Text>

          <TouchableOpacity
            onPress={() =>
              setCategoriaExpandida(expandida ? null : categoria)
            }
          >
            <Text style={styles.viewAll}>
              {expandida ? "Ver menos" : "View all"}
            </Text>
          </TouchableOpacity>
        </View>

        {lista.length === 0 ? (
          <Text style={styles.emptyText}>
            {categoria === "recientes"
              ? "Todavía no has visto ningún manga."
              : "No hay mangas disponibles."}
          </Text>
        ) : (
          <View style={styles.row}>
            {(expandida ? lista : lista.slice(0, 3)).map(renderManga)}
          </View>
        )}
      </View>
    );
  };

  const limpiarBusqueda = () => {
    setBusqueda("");
    setResultados([]);
    setModoBusqueda(false);
    setErrorBusqueda("");
    setCategoriaExpandida(null);
    Keyboard.dismiss();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>BUSCAR MANGA</Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>
        </View>

        {/* BUSCADOR */}
        <View style={styles.searchContainer}>
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="¿Qué manga desea buscar?"
            placeholderTextColor="#777"
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={buscarMangas}
            autoCapitalize="none"
          />

          <TouchableOpacity
            onPress={buscarMangas}
            style={styles.searchButton}
            accessibilityLabel="Buscar mangas"
          >
            <Text style={styles.searchIcon}>⌕</Text>
          </TouchableOpacity>
        </View>

        {modoBusqueda && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Resultados de búsqueda
            </Text>

            <TouchableOpacity onPress={limpiarBusqueda}>
              <Text style={styles.viewAll}>Limpiar</Text>
            </TouchableOpacity>
          </View>
        )}

        {buscando && (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#111111" />
            <Text style={styles.statusText}>
              Buscando mangas...
            </Text>
          </View>
        )}

        {!buscando && modoBusqueda && errorBusqueda !== "" && (
          <Text style={styles.message}>{errorBusqueda}</Text>
        )}

        {!buscando && modoBusqueda && resultados.length > 0 && (
          <View style={styles.row}>
            {resultados.map(renderManga)}
          </View>
        )}

        {!modoBusqueda && (
          <>
            {cargandoCategorias ? (
              <View style={styles.statusContainer}>
                <ActivityIndicator size="large" color="#111111" />
                <Text style={styles.statusText}>
                  Cargando mangas...
                </Text>
              </View>
            ) : error ? (
              <View style={styles.statusContainer}>
                <Text style={styles.message}>{error}</Text>

                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={cargarCategorias}
                >
                  <Text style={styles.retryText}>
                    Intentar de nuevo
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {renderCategoria("Populares", "populares")}
                {renderCategoria("En emisión", "emision")}
                {renderCategoria(
                  "Vistos recientemente",
                  "recientes"
                )}
              </>
            )}
          </>
        )}
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingBottom: 90,
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
    fontSize: 28,
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
    fontWeight: "900",
    fontSize: 18,
  },

  searchContainer: {
    marginHorizontal: 20,
    height: 42,
    borderWidth: 1,
    borderColor: "#888888",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#111111",
  },

  searchButton: {
    height: "100%",
    minWidth: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  searchIcon: {
    fontSize: 23,
    color: "#111111",
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    flex: 1,
  },

  viewAll: {
    fontSize: 11,
    color: "#666666",
    paddingLeft: 10,
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },

  manga: {
    width: "31%",
    marginRight: "2.3%",
    marginBottom: 15,
  },

  cover: {
    height: 145,
    borderRadius: 6,
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 5,
  },

  coverImage: {
    width: "100%",
    height: "100%",
  },

  coverText: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  mangaTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 5,
    color: "#111111",
  },

  score: {
    fontSize: 10,
    color: "#777777",
    textAlign: "center",
    marginTop: 3,
  },

  emptyText: {
    marginHorizontal: 20,
    fontSize: 12,
    color: "#777777",
  },

  statusContainer: {
    paddingHorizontal: 25,
    paddingVertical: 30,
    alignItems: "center",
  },

  statusText: {
    marginTop: 10,
    fontSize: 12,
    color: "#555555",
  },

  message: {
    marginHorizontal: 20,
    marginVertical: 15,
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    lineHeight: 18,
  },

  retryButton: {
    marginTop: 12,
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

});
