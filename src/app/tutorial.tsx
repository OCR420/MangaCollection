
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const pasos = [
  {
    tipo: "buscar",
    titulo: "Descubre nuevos mangas",
    descripcion:
      "Explora el catálogo para encontrar nuevas historias. Puedes escribir el nombre de un manga en el buscador y revisar los resultados disponibles.",
    consejo:
      "Consejo: selecciona un manga para conocer más sobre su historia y consultar su información.",
  },
  {
    tipo: "detalle",
    titulo: "Conoce cada manga",
    descripcion:
      "Cuando encuentres un manga interesante, entra en su ficha para consultar información como su sinopsis, autor, editorial y cantidad de tomos.",
    consejo:
      "Consejo: revisa la información del manga antes de incorporarlo a tus listas.",
  },
  {
    tipo: "coleccion",
    titulo: "Construye tu colección",
    descripcion:
      "En Mi colección puedes llevar el registro de los mangas que tienes. Selecciona una serie y marca los tomos que ya forman parte de tu colección.",
    consejo:
      "Consejo: mantén actualizados los tomos poseídos para consultar cuáles te faltan y seguir tu progreso.",
  },
  {
    tipo: "deseos",
    titulo: "Organiza tus próximos tomos",
    descripcion:
      "Utiliza la lista de deseos para guardar los mangas y tomos que quieres conseguir. Así tendrás organizadas tus próximas adquisiciones.",
    consejo:
      "Consejo: cuando consigas un tomo, actualiza tus listas para mantener tu inventario al día.",
  },
  {
    tipo: "perfil",
    titulo: "Consulta tu progreso",
    descripcion:
      "Desde tu perfil puedes consultar tus estadísticas, revisar la información de tu cuenta y acceder nuevamente a este tutorial cuando lo necesites.",
    consejo:
      "¡Listo! Ya conoces las principales funciones de Manga Collection. Es momento de organizar tu colección.",
  },
];

function Ilustracion({ tipo }: { tipo: string }) {
  return (
    <View style={styles.ilustracion}>
      <View style={styles.miniApp}>
        <View style={styles.miniHeader}>
          <View>
            <Text style={styles.miniLogo}>MANGA</Text>
            <Text style={styles.miniSubLogo}>COLLECTION</Text>
          </View>
          <View style={styles.miniAvatar}>
            <Text style={styles.miniAvatarText}>M</Text>
          </View>
        </View>

        {tipo === "buscar" && (
          <View>
            <Text style={styles.miniTitulo}>Explorar mangas</Text>

            <View style={styles.buscador}>
              <Text style={styles.buscadorIcono}>⌕</Text>
              <Text style={styles.buscadorTexto}>Buscar un manga...</Text>
            </View>

            <Text style={styles.miniEtiqueta}>RESULTADOS POPULARES</Text>

            <View style={styles.resultados}>
              <Portada titulo="ONE PIECE" numero="01" />
              <Portada titulo="BERSERK" numero="02" />
              <Portada titulo="NARUTO" numero="03" />
            </View>

            <Text style={styles.miniNota}>
              Encuentra tu próxima lectura
            </Text>
          </View>
        )}

        {tipo === "detalle" && (
          <View>
            <Text style={styles.miniEtiqueta}>DETALLES DEL MANGA</Text>

            <View style={styles.detalleManga}>
              <Portada titulo="MANGA" numero="01" grande />
              <View style={styles.detalleInfo}>
                <Text style={styles.detalleTitulo}>Nombre del manga</Text>
                <Text style={styles.detalleTexto}>Autor: Nombre del autor</Text>
                <Text style={styles.detalleTexto}>Editorial: Editorial</Text>
                <Text style={styles.detalleTexto}>Tomos: 20</Text>
                <View style={styles.etiquetaEstado}>
                  <Text style={styles.etiquetaEstadoTexto}>En emisión</Text>
                </View>
              </View>
            </View>

            <View style={styles.sinopsis}>
              <Text style={styles.sinopsisTitulo}>SINOPSIS</Text>
              <Text style={styles.sinopsisTexto}>
                Conoce la historia y descubre si es el manga que buscas...
              </Text>
            </View>

            <View style={styles.botonMini}>
              <Text style={styles.botonMiniTexto}>Agregar a mi colección</Text>
            </View>
          </View>
        )}

        {tipo === "coleccion" && (
          <View>
            <Text style={styles.miniTitulo}>Mi colección</Text>
            <Text style={styles.miniSubtitulo}>
              Tus mangas y tomos registrados
            </Text>

            <View style={styles.tarjetaColeccion}>
              <View style={styles.coleccionCabecera}>
                <Text style={styles.coleccionNombre}>ONE PIECE</Text>
                <Text style={styles.coleccionPorcentaje}>60%</Text>
              </View>

              <View style={styles.barraFondo}>
                <View style={styles.barraProgreso} />
              </View>

              <Text style={styles.miniEtiqueta}>TOMOS DE LA SERIE</Text>

              <View style={styles.tomitos}>
                {["01", "02", "03", "04", "05", "06", "07", "08"].map(
                  (numero, index) => (
                    <View
                      key={numero}
                      style={[
                        styles.tomito,
                        index < 5 && styles.tomitoPoseido,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tomitoTexto,
                          index < 5 && styles.tomitoTextoPoseido,
                        ]}
                      >
                        {numero}
                      </Text>
                    </View>
                  )
                )}
              </View>

              <View style={styles.leyenda}>
                <View style={styles.leyendaItem}>
                  <View style={styles.puntoPoseido} />
                  <Text style={styles.leyendaTexto}>Poseído</Text>
                </View>
                <View style={styles.leyendaItem}>
                  <View style={styles.puntoFaltante} />
                  <Text style={styles.leyendaTexto}>Faltante</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {tipo === "deseos" && (
          <View>
            <Text style={styles.miniTitulo}>Lista de deseos</Text>
            <Text style={styles.miniSubtitulo}>
              Los tomos que quieres conseguir
            </Text>

            {[110, 111, 112].map((numero) => (
              <View style={styles.deseoItem} key={numero}>
                <View style={styles.deseoPortada}>
                  <Text style={styles.deseoPortadaTexto}>M</Text>
                </View>
                <View style={styles.deseoInfo}>
                  <Text style={styles.deseoNombre}>One Piece</Text>
                  <Text style={styles.deseoDetalle}>
                    Tomo {numero}
                  </Text>
                  <Text style={styles.deseoPrecio}>$40.000</Text>
                </View>
                <Text style={styles.deseoCorazon}>♡</Text>
              </View>
            ))}

            <View style={styles.resumenDeseos}>
              <Text style={styles.resumenTexto}>
                Mantén organizados tus próximos objetivos
              </Text>
            </View>
          </View>
        )}

        {tipo === "perfil" && (
          <View>
            <View style={styles.perfilCabecera}>
              <View style={styles.perfilAvatar}>
                <Text style={styles.perfilAvatarTexto}>U</Text>
              </View>
              <Text style={styles.perfilNombre}>Tu perfil</Text>
              <Text style={styles.perfilCorreo}>usuario@correo.com</Text>
            </View>

            <Text style={styles.miniEtiqueta}>RESUMEN DE TU COLECCIÓN</Text>

            <View style={styles.estadisticas}>
              <View style={styles.estadistica}>
                <Text style={styles.estadisticaNumero}>12</Text>
                <Text style={styles.estadisticaTexto}>Mangas</Text>
              </View>
              <View style={styles.estadistica}>
                <Text style={styles.estadisticaNumero}>85</Text>
                <Text style={styles.estadisticaTexto}>Tomos</Text>
              </View>
              <View style={styles.estadistica}>
                <Text style={styles.estadisticaNumero}>68%</Text>
                <Text style={styles.estadisticaTexto}>Progreso</Text>
              </View>
            </View>

            <View style={styles.opcionPerfil}>
              <Text style={styles.opcionPerfilTexto}>
                Consultar tutorial nuevamente
              </Text>
              <Text style={styles.opcionFlecha}>›</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.decoracionUno} />
      <View style={styles.decoracionDos} />
    </View>
  );
}

function Portada({
  titulo,
  numero,
  grande = false,
}: {
  titulo: string;
  numero: string;
  grande?: boolean;
}) {
  return (
    <View style={[styles.portada, grande && styles.portadaGrande]}>
      <Text style={styles.portadaM}>M</Text>
      <Text style={styles.portadaTitulo}>{titulo}</Text>
      <Text style={styles.portadaNumero}>{numero}</Text>
    </View>
  );
}

export default function TutorialScreen() {
  const [pasoActual, setPasoActual] = useState(0);
  const [guardando, setGuardando] = useState(false);

  const finalizar = async () => {
    if (guardando) return;

    try {
      setGuardando(true);

      const usuarioGuardado = await AsyncStorage.getItem("usuario");

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        const usuarioId = usuario._id || usuario.id || usuario.email;

        await AsyncStorage.setItem(
          `tutorialVisto_${usuarioId}`,
          "true"
        );
      }

      router.replace("/home");
    } catch (error) {
      console.error("Error al finalizar tutorial:", error);
      setGuardando(false);
    }
  };

  const avanzar = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      finalizar();
    }
  };

  const retroceder = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  const paso = pasos[pasoActual];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>MANGA</Text>
          <Text style={styles.logoSub}>COLLECTION</Text>
        </View>

        <TouchableOpacity
          style={styles.omitir}
          onPress={finalizar}
          disabled={guardando}
        >
          <Text style={styles.omitirTexto}>Omitir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progresoSuperior}>
        <View
          style={[
            styles.progresoSuperiorActivo,
            { width: `${((pasoActual + 1) / pasos.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContenido}
        showsVerticalScrollIndicator={false}
      >
        <Ilustracion tipo={paso.tipo} />

        <View style={styles.contenido}>
          <Text style={styles.contador}>
            GUÍA DE INICIO · {pasoActual + 1} DE {pasos.length}
          </Text>

          <Text style={styles.titulo}>{paso.titulo}</Text>

          <Text style={styles.descripcion}>
            {paso.descripcion}
          </Text>

          <View style={styles.consejo}>
            <Text style={styles.consejoEtiqueta}>RECUERDA</Text>
            <Text style={styles.consejoTexto}>{paso.consejo}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.indicadores}>
          {pasos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicador,
                pasoActual === index && styles.indicadorActivo,
              ]}
            />
          ))}
        </View>

        <View style={styles.botones}>
          {pasoActual > 0 ? (
            <TouchableOpacity
              style={styles.botonAnterior}
              onPress={retroceder}
              disabled={guardando}
            >
              <Text style={styles.anteriorTexto}>Anterior</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.botonAnterior} />
          )}

          <TouchableOpacity
            style={styles.botonSiguiente}
            onPress={avanzar}
            disabled={guardando}
          >
            {guardando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.siguienteTexto}>
                {pasoActual === pasos.length - 1
                  ? "Comenzar"
                  : "Siguiente"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 42,
  },
  header: {
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  logo: {
    fontSize: 23,
    fontWeight: "900",
    color: "#111111",
    letterSpacing: 1,
  },
  logoSub: {
    fontSize: 9,
    letterSpacing: 4,
    color: "#777777",
  },
  omitir: {
    padding: 10,
  },
  omitirTexto: {
    color: "#777777",
    fontSize: 13,
    fontWeight: "600",
  },
  progresoSuperior: {
    height: 3,
    backgroundColor: "#EEEEEE",
    marginHorizontal: 24,
  },
  progresoSuperiorActivo: {
    height: 3,
    backgroundColor: "#111111",
  },
  scroll: {
    flex: 1,
  },
  scrollContenido: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  ilustracion: {
    height: 245,
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    marginTop: 22,
    marginBottom: 25,
    padding: 14,
    justifyContent: "center",
    overflow: "hidden",
  },
  miniApp: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    minHeight: 205,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  miniHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
    paddingBottom: 9,
    marginBottom: 10,
  },
  miniLogo: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111111",
  },
  miniSubLogo: {
    fontSize: 6,
    letterSpacing: 3,
    color: "#888888",
  },
  miniAvatar: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  miniTitulo: {
    fontSize: 14,
    color: "#111111",
    fontWeight: "900",
    marginBottom: 3,
  },
  miniSubtitulo: {
    color: "#888888",
    fontSize: 9,
    marginBottom: 12,
  },
  buscador: {
    height: 30,
    backgroundColor: "#F2F2F2",
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    marginBottom: 12,
  },
  buscadorIcono: {
    fontSize: 18,
    color: "#555555",
    marginRight: 7,
  },
  buscadorTexto: {
    color: "#999999",
    fontSize: 10,
  },
  miniEtiqueta: {
    fontSize: 8,
    fontWeight: "900",
    color: "#888888",
    letterSpacing: 1,
    marginBottom: 9,
  },
  resultados: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  portada: {
    width: 57,
    height: 78,
    backgroundColor: "#222222",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  portadaGrande: {
    width: 88,
    height: 125,
  },
  portadaM: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "900",
  },
  portadaTitulo: {
    color: "#FFFFFF",
    fontSize: 7,
    fontWeight: "bold",
    textAlign: "center",
  },
  portadaNumero: {
    color: "#CCCCCC",
    fontSize: 7,
    marginTop: 3,
  },
  miniNota: {
    fontSize: 8,
    color: "#888888",
    marginTop: 9,
    textAlign: "center",
  },
  detalleManga: {
    flexDirection: "row",
    gap: 12,
    marginTop: 5,
  },
  detalleInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  detalleTitulo: {
    fontSize: 11,
    fontWeight: "900",
    color: "#111111",
  },
  detalleTexto: {
    fontSize: 8,
    color: "#777777",
  },
  etiquetaEstado: {
    backgroundColor: "#EEEEEE",
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  etiquetaEstadoTexto: {
    fontSize: 7,
    color: "#333333",
    fontWeight: "bold",
  },
  sinopsis: {
    marginTop: 12,
  },
  sinopsisTitulo: {
    fontSize: 8,
    fontWeight: "900",
    color: "#444444",
    marginBottom: 3,
  },
  sinopsisTexto: {
    fontSize: 8,
    color: "#888888",
  },
  botonMini: {
    backgroundColor: "#111111",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  botonMiniTexto: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "bold",
  },
  tarjetaColeccion: {
    backgroundColor: "#FAFAFA",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  coleccionCabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  coleccionNombre: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },
  coleccionPorcentaje: {
    color: "#111111",
    fontSize: 10,
    fontWeight: "900",
  },
  barraFondo: {
    height: 6,
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
    marginBottom: 10,
  },
  barraProgreso: {
    width: "60%",
    height: 6,
    backgroundColor: "#111111",
    borderRadius: 5,
  },
  tomitos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  tomito: {
    width: 34,
    height: 36,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  tomitoPoseido: {
    backgroundColor: "#222222",
    borderColor: "#222222",
  },
  tomitoTexto: {
    fontSize: 9,
    color: "#777777",
  },
  tomitoTextoPoseido: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  leyenda: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  leyendaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  puntoPoseido: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#222222",
  },
  puntoFaltante: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#DDDDDD",
    borderWidth: 1,
    borderColor: "#AAAAAA",
  },
  leyendaTexto: {
    fontSize: 8,
    color: "#777777",
  },
  deseoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: "#EEEEEE",
  },
  deseoPortada: {
    width: 34,
    height: 42,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  deseoPortadaTexto: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 17,
  },
  deseoInfo: {
    flex: 1,
    marginLeft: 10,
    gap: 2,
  },
  deseoNombre: {
    fontSize: 10,
    color: "#111111",
    fontWeight: "bold",
  },
  deseoDetalle: {
    fontSize: 8,
    color: "#888888",
  },
  deseoPrecio: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#333333",
  },
  deseoCorazon: {
    fontSize: 22,
    color: "#333333",
  },
  resumenDeseos: {
    backgroundColor: "#F2F2F2",
    borderRadius: 5,
    padding: 7,
    marginTop: 8,
  },
  resumenTexto: {
    fontSize: 8,
    color: "#666666",
    textAlign: "center",
  },
  perfilCabecera: {
    alignItems: "center",
    marginBottom: 15,
  },
  perfilAvatar: {
    width: 43,
    height: 43,
    borderRadius: 25,
    backgroundColor: "#222222",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  perfilAvatarTexto: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "bold",
  },
  perfilNombre: {
    fontSize: 12,
    color: "#111111",
    fontWeight: "900",
  },
  perfilCorreo: {
    fontSize: 8,
    color: "#888888",
    marginTop: 3,
  },
  estadisticas: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 12,
  },
  estadistica: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    borderRadius: 6,
    padding: 9,
    alignItems: "center",
  },
  estadisticaNumero: {
    color: "#111111",
    fontSize: 16,
    fontWeight: "900",
  },
  estadisticaTexto: {
    color: "#777777",
    fontSize: 8,
    marginTop: 3,
  },
  opcionPerfil: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,
  },
  opcionPerfilTexto: {
    color: "#333333",
    fontSize: 9,
  },
  opcionFlecha: {
    color: "#555555",
    fontSize: 14,
  },
  decoracionUno: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#FFFFFF",
    opacity: 0.12,
    top: -30,
    right: -20,
  },
  decoracionDos: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    opacity: 0.12,
    bottom: -20,
    left: -15,
  },
  contenido: {
    paddingHorizontal: 3,
  },
  contador: {
    color: "#999999",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 25,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  consejo: {
    backgroundColor: "#F5F5F5",
    borderLeftWidth: 3,
    borderLeftColor: "#111111",
    padding: 12,
    marginTop: 18,
    borderRadius: 5,
  },
  consejoEtiqueta: {
    color: "#888888",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 5,
  },
  consejoTexto: {
    color: "#444444",
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "#F0F0F0",
    backgroundColor: "#FFFFFF",
  },
  indicadores: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginBottom: 14,
  },
  indicador: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#DDDDDD",
  },
  indicadorActivo: {
    width: 23,
    backgroundColor: "#111111",
  },
  botones: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  botonAnterior: {
    minWidth: 110,
    paddingVertical: 13,
    alignItems: "center",
  },
  anteriorTexto: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "700",
  },
  botonSiguiente: {
    backgroundColor: "#111111",
    borderRadius: 7,
    minWidth: 140,
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  siguienteTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
