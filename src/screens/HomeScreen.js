import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";

import { mangas } from "../data/mangas";

export default function HomeScreen({ navigation }) {

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hola, Oscar 👋
          </Text>

          <Text style={styles.subtitle}>
            Tu colección
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
        >
          <Text style={styles.profile}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statText}>Series</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>139</Text>
          <Text style={styles.statText}>Tomos</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statNumber}>67%</Text>
          <Text style={styles.statText}>Progreso</Text>
        </View>

      </View>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate("Search")}
      >
        <Text style={styles.searchText}>
          🔎 Buscar manga
        </Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>
        Mi colección
      </Text>

      {mangas.map((manga) => {

        const progreso =
          Math.round((manga.poseidos / manga.totalTomos) * 100);

        return (
          <TouchableOpacity
            key={manga.id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("MangaDetail", {
                manga
              })
            }
          >

            <View style={styles.cover}>
              <Text style={styles.coverText}>
                {manga.titulo}
              </Text>
            </View>

            <View style={styles.cardInfo}>

              <Text style={styles.mangaTitle}>
                {manga.titulo}
              </Text>

              <Text style={styles.editorial}>
                {manga.editorial}
              </Text>

              <Text style={styles.volumes}>
                {manga.poseidos} / {manga.totalTomos} tomos
              </Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progress,
                    { width: `${progreso}%` }
                  ]}
                />
              </View>

              <Text style={styles.percentage}>
                {progreso}% completado
              </Text>

            </View>

          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={() => navigation.navigate("Wishlist")}
      >
        <Text style={styles.wishlistText}>
          ❤️ Ver Wishlist
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  greeting: {
    fontSize: 25,
    fontWeight: "800"
  },

  subtitle: {
    color: "#666666",
    marginTop: 4
  },

  profile: {
    fontSize: 30
  },

  stats: {
    flexDirection: "row",
    backgroundColor: "#111111",
    borderRadius: 15,
    padding: 20,
    justifyContent: "space-around",
    marginBottom: 20
  },

  stat: {
    alignItems: "center"
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800"
  },

  statText: {
    color: "#CCCCCC",
    marginTop: 5
  },

  searchButton: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 25
  },

  searchText: {
    fontSize: 16,
    color: "#555555"
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 12,
    flexDirection: "row",
    marginBottom: 15
  },

  cover: {
    width: 90,
    height: 125,
    backgroundColor: "#222222",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 8
  },

  coverText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700"
  },

  cardInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center"
  },

  mangaTitle: {
    fontSize: 18,
    fontWeight: "800"
  },

  editorial: {
    color: "#777777",
    marginTop: 4
  },

  volumes: {
    marginTop: 12,
    fontSize: 13
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#DDDDDD",
    borderRadius: 10,
    marginTop: 7
  },

  progress: {
    height: 7,
    backgroundColor: "#111111",
    borderRadius: 10
  },

  percentage: {
    fontSize: 12,
    marginTop: 5
  },

  wishlistButton: {
    backgroundColor: "#111111",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15
  },

  wishlistText: {
    color: "#FFFFFF",
    fontWeight: "700"
  }
});