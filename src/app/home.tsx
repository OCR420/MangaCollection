import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const mangas = [
  {
    id: 1,
    titulo: "One Piece",
    poseidos: 20,
    total: 115,
    porcentaje: 17,
  },
  {
    id: 2,
    titulo: "Inuyasha",
    poseidos: 56,
    total: 56,
    porcentaje: 100,
  },
  {
    id: 3,
    titulo: "Berserk",
    poseidos: 15,
    total: 42,
    porcentaje: 36,
  },
  {
    id: 4,
    titulo: "Chainsaw Man",
    poseidos: 8,
    total: 19,
    porcentaje: 42,
  },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* ENCABEZADO */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => router.back()}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            MANGA COLLECTION
          </Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

        </View>

        <Text style={styles.subtitle}>
          MI COLECCIÓN
        </Text>

        {/* BUSCADOR */}

        <View style={styles.searchContainer}>

          <TextInput
            style={styles.searchInput}
            placeholder="Busca tus mangas..."
            placeholderTextColor="#777"
          />

          <Text style={styles.searchIcon}>
            ⌕
          </Text>

        </View>

        {/* GRID */}

        <View style={styles.grid}>

          {mangas.map((manga) => (

            <TouchableOpacity
              key={manga.id}
              style={styles.card}
              onPress={() =>
                router.push(`/manga/${manga.id}`)
              }
            >

              {/* PORTADA */}

              <View style={styles.cover}>
                <Text style={styles.coverTitle}>
                  {manga.titulo}
                </Text>
              </View>

              {/* INFORMACIÓN */}

              <Text
                style={styles.mangaTitle}
                numberOfLines={1}
              >
                {manga.titulo}
              </Text>

              <Text style={styles.volumeText}>
                {manga.poseidos} / {manga.total}
              </Text>

              {/* PROGRESO */}

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${manga.porcentaje}%`,
                    },
                  ]}
                />
              </View>

              <Text style={styles.percentage}>
                {manga.porcentaje}%
              </Text>

            </TouchableOpacity>

          ))}

        </View>

      </ScrollView>

      {/* NAVBAR */}

      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navText}>
            HOME
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
        >
          <Text style={styles.navIconActive}>
            ▮
          </Text>

          <Text style={styles.navTextActive}>
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
    fontSize: 28,
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
    backgroundColor: "#111111",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },

  subtitle: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
    marginBottom: 14,
    color: "#333333",
  },

  searchContainer: {
    height: 38,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#999999",
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 12,
    color: "#111111",
  },

  searchIcon: {
    fontSize: 18,
    paddingRight: 10,
    color: "#222222",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },

  card: {
    width: "48%",
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 7,
    padding: 8,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },

  cover: {
    height: 125,
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  coverTitle: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    color: "#333333",
  },

  mangaTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 7,
    color: "#111111",
  },

  volumeText: {
    fontSize: 10,
    color: "#555555",
    marginTop: 3,
  },

  progressBackground: {
    height: 4,
    backgroundColor: "#D9D9D9",
    marginTop: 7,
    overflow: "hidden",
  },

  progress: {
    height: 4,
    backgroundColor: "#315EB7",
  },

  percentage: {
    fontSize: 10,
    color: "#555555",
    marginTop: 3,
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
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 17,
    color: "#AAAAAA",
  },

  navIconActive: {
    fontSize: 17,
    color: "#222222",
  },

  navText: {
    fontSize: 8,
    color: "#999999",
    marginTop: 3,
  },

  navTextActive: {
    fontSize: 8,
    color: "#222222",
    fontWeight: "700",
    marginTop: 3,
  },

});