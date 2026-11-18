import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import BottomNav from "../components/BottomNav";
import { api } from "../data/api";


type Manga = {
  _id: string;
  mal_id?: number;
  titulo: string;
  total_tomos: number;
  imagen_url?: string;
};

type Volumen = {
  _id: string;
  manga_id: Manga | string;
  numero_tomo: number;
  estado: "poseido" | "deseado";
};

export default function HomeScreen() {
  const [mangas, setMangas] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const cargarColeccion = useCallback(async () => {
    try {
      setActualizando(true);

      const usuarioTexto = await AsyncStorage.getItem("usuario");

      if (!usuarioTexto) {
        setMangas([]);
        router.replace("/");
        return;
      }

      const usuario = JSON.parse(usuarioTexto);
      const respuesta = await api.get(
        `/usuarios/${usuario._id}/volumenes`
      );

      const volumenes: Volumen[] = respuesta.data;
      const grupos: Record<string, any> = {};

      volumenes
        .filter((volumen) => volumen.estado === "poseido")
        .forEach((volumen) => {
          const manga = volumen.manga_id;

          if (!manga || typeof manga === "string") return;

          if (!grupos[manga._id]) {
            grupos[manga._id] = {
              ...manga,
              volumenesPoseidos: [],
              poseidos: 0,
              porcentaje: null,
            };
          }

          grupos[manga._id].volumenesPoseidos.push({
            _id: volumen._id,
            numero_tomo: Number(volumen.numero_tomo),
          });
        });

      const resultado = Object.values(grupos).map((manga: any) => {
        const tomosUnicos = [
          ...new Set(
            manga.volumenesPoseidos.map((tomo: any) => tomo.numero_tomo)
          ),
        ];

        const total = Number(manga.total_tomos);

        // Solo calculamos el porcentaje si existe un total válido.
        const totalValido =
          manga.total_tomos !== null &&
          manga.total_tomos !== undefined &&
          manga.total_tomos !== "" &&
          Number.isFinite(total) &&
          total > 0;

        const porcentaje = totalValido
          ? Math.min(100, Math.round((tomosUnicos.length / total) * 100))
          : null;

        return {
          ...manga,
          volumenesPoseidos: manga.volumenesPoseidos.sort(
            (a: any, b: any) => a.numero_tomo - b.numero_tomo
          ),
          poseidos: tomosUnicos.length,
          total_tomos: totalValido ? total : null,
          porcentaje,
        };
      });

      setMangas(resultado);
    } catch (error: any) {
      console.error(
        "Error al cargar la colección:",
        error.response?.data || error.message
      );
      Alert.alert("Error", "No se pudo cargar tu colección.");
    } finally {
      setCargando(false);
      setActualizando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarColeccion();
    }, [cargarColeccion])
  );

  const mangasFiltrados = mangas.filter((manga) =>
    manga.titulo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  function abrirManga(manga: any) {
    if (manga.mal_id) {
      router.push(`/manga/${manga.mal_id}`);
    } else {
      Alert.alert(
        "Ficha no disponible",
        "Este manga no tiene un identificador externo. Puedes buscarlo en la sección Buscar."
      );
    }
  }

  async function eliminarTomo(manga: any, tomo: any) {
    Alert.alert(
      "Eliminar tomo",
      `¿Quieres eliminar el tomo ${tomo.numero_tomo} de ${manga.titulo}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/volumenes/${tomo._id}`);

              Alert.alert(
                "Listo",
                `El tomo ${tomo.numero_tomo} fue eliminado de tu colección.`
              );

              await cargarColeccion();
            } catch (error: any) {
              console.error(
                "Error al eliminar tomo:",
                error.response?.data || error.message
              );

              Alert.alert(
                "Error",
                "No se pudo eliminar el tomo. Inténtalo nuevamente."
              );
            }
          },
        },
      ]
    );
  }

  async function eliminarManga(manga: any) {
    Alert.alert(
      "Eliminar manga",
      `¿Quieres quitar "${manga.titulo}" de tu colección? Se eliminarán todos los tomos que tienes registrados de este manga.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
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
                { params: { estado: "poseido" } }
              );

              setMangas((actuales) =>
                actuales.filter((item) => item._id !== manga._id)
              );

              Alert.alert("Listo", "El manga fue eliminado de tu colección.");
            } catch (error: any) {
              console.error(
                "Error al eliminar manga:",
                error.response?.data || error.message
              );
              Alert.alert("Error", "No se pudo eliminar el manga.");
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.pantalla}>
      <ScrollView
        style={styles.contenedor}
        contentContainerStyle={styles.contenido}
      >
        <Text style={styles.marca}>MANGA COLLECTION</Text>
        <Text style={styles.titulo}>MI COLECCIÓN</Text>
        <Text style={styles.descripcion}>
          Consulta los mangas y los tomos que tienes registrados.
        </Text>

        <TextInput
          style={styles.busqueda}
          placeholder="Busca tus mangas..."
          value={busqueda}
          onChangeText={setBusqueda}
        />

        <TouchableOpacity
          style={styles.botonActualizar}
          onPress={cargarColeccion}
          disabled={actualizando}
        >
          <Text style={styles.textoActualizar}>
            {actualizando ? "Actualizando..." : "Actualizar colección"}
          </Text>
        </TouchableOpacity>

        {cargando ? (
          <ActivityIndicator size="large" color="#111" style={styles.carga} />
        ) : mangasFiltrados.length === 0 ? (
          <View style={styles.vacio}>
            <Text style={styles.vacioTitulo}>
              {busqueda ? "No hay resultados" : "Tu colección está vacía"}
            </Text>
            <Text style={styles.vacioTexto}>
              {busqueda
                ? "Prueba con otro título."
                : "Busca un manga y agrega los tomos que ya tienes."}
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
          <View style={styles.grid}>

            {mangasFiltrados.map((manga) => (
              <View key={manga._id} style={styles.tarjeta}>
                <TouchableOpacity onPress={() => abrirManga(manga)}>

                  <View style={styles.portada}>
                    {manga.imagen_url ? (
                      <Image
                        source={{ uri: manga.imagen_url }}
                        style={styles.imagenPortada}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.portadaTexto} numberOfLines={3}>
                        {manga.titulo}
                      </Text>
                    )}
                  </View>


                  <Text style={styles.nombreManga} numberOfLines={2}>
                    {manga.titulo}
                  </Text>

                  <Text style={styles.progresoTexto}>
                    {manga.total_tomos
                      ? `${manga.poseidos} de ${manga.total_tomos} tomos`
                      : `${manga.poseidos} tomos registrados`}
                  </Text>

                  {manga.total_tomos ? (
                    <>
                      <View style={styles.barraFondo}>
                        <View
                          style={[
                            styles.barraProgreso,
                            { width: `${manga.porcentaje}%` },
                          ]}
                        />
                      </View>

                      <Text style={styles.porcentaje}>
                        {manga.porcentaje}% completado
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.sinTotal}>
                      Cantidad total de tomos no disponible
                    </Text>
                  )}
                </TouchableOpacity>
                <View style={styles.seccionTomos}>
                  <Text style={styles.tituloTomos}>
                    TOMOS REGISTRADOS
                  </Text>

                  <View style={styles.listaTomos}>
                    {manga.volumenesPoseidos.map((tomo: any) => (
                      <TouchableOpacity
                        key={tomo._id}
                        style={styles.tomoItem}
                        onPress={() => eliminarTomo(manga, tomo)}
                      >
                        <Text style={styles.tomoNumero}>
                          {tomo.numero_tomo}
                        </Text>

                        <Text style={styles.tomoEliminar}>
                          ×
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.ayudaTomos}>
                    Pulsa un tomo para eliminarlo
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.eliminarManga}
                  onPress={() => eliminarManga(manga)}
                >
                  <Text style={styles.eliminarMangaTexto}>
                    Eliminar manga
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      <BottomNav active="collection" />
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
  busqueda: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "#111"
  },
  botonActualizar: { alignSelf: "flex-end", paddingVertical: 12 },
  textoActualizar: { fontSize: 13, color: "#444" },
  carga: { marginTop: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tarjeta: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 14
  },


  eliminarManga: {
    backgroundColor: "#f5eaea",
    padding: 9,
    borderRadius: 6,
    marginTop: 12,
    alignItems: "center"
  },
  eliminarMangaTexto: {
    color: "#b42318",
    fontSize: 12,
    fontWeight: "bold"
  },

  portada: {
    height: 190,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    overflow: "hidden"
  },
  imagenPortada: {
    width: "100%",
    height: "100%"
  },
  portadaTexto: {
    color: "#444",
    fontWeight: "bold",
    textAlign: "center",
    padding: 10
  },

  sinTotal: {
    fontSize: 10,
    color: "#999",
    marginTop: 7,
  },

  seccionTomos: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
  },

  tituloTomos: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 9,
    letterSpacing: 0.5,
  },

  listaTomos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  tomoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 5,
    paddingVertical: 7,
    paddingHorizontal: 9,
    minWidth: 43,
  },

  tomoNumero: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#222",
  },

  tomoEliminar: {
    color: "#b42318",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },

  ayudaTomos: {
    fontSize: 9,
    color: "#999",
    marginTop: 7,
  },



  nombreManga: { fontSize: 15, fontWeight: "bold", marginTop: 10, color: "#111" },
  progresoTexto: { fontSize: 12, color: "#555", marginTop: 6 },
  barraFondo: { height: 6, backgroundColor: "#e5e5e5", borderRadius: 5, marginTop: 8 },
  barraProgreso: { height: 6, backgroundColor: "#111", borderRadius: 5 },
  porcentaje: { fontSize: 11, color: "#555", marginTop: 5 },
  vacio: { alignItems: "center", paddingVertical: 45 },
  vacioTitulo: { fontSize: 18, fontWeight: "bold", color: "#111" },
  vacioTexto: { color: "#666", textAlign: "center", marginTop: 10, lineHeight: 21 },
  boton: { backgroundColor: "#111", padding: 13, borderRadius: 8, marginTop: 18 },
  textoBoton: { color: "#fff", fontWeight: "bold" },


});
