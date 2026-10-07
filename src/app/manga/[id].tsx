import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

const mangas: any = {
  "1": {
    titulo: "One Piece",
    genero: "Shonen",
    tomo: "110",
    descripcion:
      "La historia comienza con la ejecución de Gold D. Roger, conocido como el Rey de los Piratas. Antes de morir, Roger anuncia que dejó su tesoro, el One Piece, en un lugar llamado Grand Line. Esto desencadena la gran era de los piratas.",
  },

  "2": {
    titulo: "Inuyasha",
    genero: "Shonen",
    tomo: "56",
    descripcion:
      "Kagome viaja accidentalmente al Japón feudal y conoce a Inuyasha. Juntos deberán enfrentarse a numerosos enemigos mientras buscan los fragmentos de la Perla de Shikon.",
  },

  "3": {
    titulo: "Berserk",
    genero: "Seinen",
    tomo: "42",
    descripcion:
      "La historia sigue a Guts, un guerrero marcado por un pasado lleno de conflictos, mientras lucha por sobrevivir en un mundo dominado por guerras, monstruos y fuerzas sobrenaturales.",
  },
};

export default function MangaDetailScreen() {
  const { id } = useLocalSearchParams();

  const manga = mangas[String(id)] || mangas["1"];

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            DETALLES
          </Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

        </View>

        {/* PORTADA */}

        <View style={styles.coverContainer}>

          <View style={styles.cover}>
            <Text style={styles.coverText}>
              {manga.titulo}
            </Text>
          </View>

        </View>

        {/* INFORMACIÓN */}

        <View style={styles.info}>

          <Text style={styles.title}>
            {manga.titulo}
          </Text>

          <View style={styles.genre}>
            <Text style={styles.genreText}>
              {manga.genero}
            </Text>
          </View>

          {/* TOMO */}

          <View style={styles.volumeRow}>

            <Text style={styles.volumeLabel}>
              Tomo:
            </Text>

            <View style={styles.volumeBox}>
              <Text style={styles.volumeText}>
                {manga.tomo}
              </Text>
            </View>

          </View>

          {/* DESCRIPCIÓN */}

          <View style={styles.descriptionBox}>

            <Text style={styles.description}>
              {manga.descripcion}
            </Text>

            <Text style={styles.more}>
              ... ver más
            </Text>

          </View>

          {/* BOTÓN */}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/home")}
          >
            <Text style={styles.addButtonText}>
              Agregar a mi colección!
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

      {/* NAVBAR */}

      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navText}>
            HOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.navIcon}>
            ▮
          </Text>

          <Text style={styles.navText}>
            COLLECTION
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/wishlist")}
        >
          <Text style={styles.navIcon}>
            ♡
          </Text>

          <Text style={styles.navText}>
            WISHLIST
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.navIcon}>
            ♙
          </Text>

          <Text style={styles.navText}>
            PERFIL
          </Text>
        </TouchableOpacity>

      </View>

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
    fontSize: 29,
    color: "#111111",
  },

  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111111",
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

  coverContainer: {
    paddingHorizontal: 20,
    marginTop: 5,
  },

  cover: {
    height: 205,
    borderRadius: 8,
    backgroundColor: "#D7D7D7",
    borderWidth: 1,
    borderColor: "#BBBBBB",
    justifyContent: "center",
    alignItems: "center",
  },

  coverText: {
    fontSize: 30,
    fontWeight: "900",
    color: "#333333",
    textAlign: "center",
  },

  info: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111111",
  },

  genre: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 7,
  },

  genreText: {
    fontSize: 10,
    color: "#555555",
  },

  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  volumeLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginRight: 8,
  },

  volumeBox: {
    width: 55,
    height: 28,
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  volumeText: {
    fontSize: 11,
  },

  descriptionBox: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },

  description: {
    fontSize: 11,
    lineHeight: 17,
    color: "#333333",
  },

  more: {
    fontSize: 10,
    color: "#555555",
    textAlign: "right",
    marginTop: 4,
  },

  addButton: {
    height: 40,
    backgroundColor: "#111111",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 68,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    alignItems: "center",
  },

  navIcon: {
    fontSize: 17,
    color: "#AAAAAA",
  },

  navText: {
    fontSize: 8,
    color: "#999999",
    marginTop: 3,
  },

});