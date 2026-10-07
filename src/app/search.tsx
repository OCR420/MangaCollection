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

const populares = [
  { id: 1, titulo: "Berserk" },
  { id: 2, titulo: "Chainsaw Man" },
  { id: 3, titulo: "One Piece" },
];

const emision = [
  { id: 1, titulo: "One Piece" },
  { id: 2, titulo: "Inuyasha" },
  { id: 3, titulo: "X" },
];

const recientes = [
  { id: 1, titulo: "Inuyasha" },
  { id: 2, titulo: "Chainsaw Man" },
  { id: 3, titulo: "One Piece" },
];

export default function SearchScreen() {

  const renderManga = (manga: any) => (
    <TouchableOpacity
      key={manga.id}
      style={styles.manga}
      onPress={() => router.push(`/manga/${manga.id}`)}
    >

      <View style={styles.cover}>
        <Text style={styles.coverText}>
          {manga.titulo}
        </Text>
      </View>

      <Text
        style={styles.mangaTitle}
        numberOfLines={1}
      >
        {manga.titulo}
      </Text>

    </TouchableOpacity>
  );

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
            BUSCAR MANGA
          </Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

        </View>

        {/* BUSCADOR */}

        <View style={styles.searchContainer}>

          <TextInput
            placeholder="¿Qué manga desea buscar?"
            placeholderTextColor="#777"
            style={styles.input}
          />

          <Text style={styles.searchIcon}>
            ⌕
          </Text>

        </View>

        {/* POPULARES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Populares
          </Text>

          <Text style={styles.viewAll}>
            View all
          </Text>
        </View>

        <View style={styles.row}>
          {populares.map(renderManga)}
        </View>

        {/* EN EMISIÓN */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            En emisión
          </Text>

          <Text style={styles.viewAll}>
            View all
          </Text>
        </View>

        <View style={styles.row}>
          {emision.map(renderManga)}
        </View>

        {/* RECIENTES */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Vistos recientemente
          </Text>

          <Text style={styles.viewAll}>
            View all
          </Text>
        </View>

        <View style={styles.row}>
          {recientes.map(renderManga)}
        </View>

      </ScrollView>

      {/* NAVBAR */}

      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
        >
          <Text style={styles.navIcon}>
            ⌂
          </Text>

          <Text style={styles.navActive}>
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
    height: 38,
    borderWidth: 1,
    borderColor: "#888888",
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
    fontSize: 11,
  },

  searchIcon: {
    fontSize: 17,
    paddingRight: 10,
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
  },

  viewAll: {
    fontSize: 9,
    color: "#666666",
  },

  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },

  manga: {
    width: "31%",
  },

  cover: {
    height: 92,
    borderRadius: 6,
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderColor: "#999999",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  coverText: {
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  mangaTitle: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
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

  navActive: {
    fontSize: 8,
    color: "#111111",
    fontWeight: "700",
    marginTop: 3,
  },

});