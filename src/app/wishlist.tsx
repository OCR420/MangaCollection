import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { router } from "expo-router";

const wishlistInitial = [
  {
    id: 1,
    titulo: "One Piece",
    tomo: 110,
    precio: 40000,
    seleccionado: true,
  },
  {
    id: 2,
    titulo: "One Piece",
    tomo: 111,
    precio: 40000,
    seleccionado: true,
  },
  {
    id: 3,
    titulo: "One Piece",
    tomo: 112,
    precio: 40000,
    seleccionado: false,
  },
];

export default function WishlistScreen() {

  const [items, setItems] = useState(wishlistInitial);

  const cambiarSeleccion = (id: number) => {

    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              seleccionado: !item.seleccionado,
            }
          : item
      )
    );
  };

  const presupuesto = items
    .filter((item) => item.seleccionado)
    .reduce((total, item) => total + item.precio, 0);

  const seleccionados = items.filter(
    (item) => item.seleccionado
  ).length;

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
            WISHLIST
          </Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

        </View>

        {/* BUSCADOR */}

        <View style={styles.searchContainer}>

          <TextInput
            style={styles.input}
            placeholder="Busca tus selecciones..."
            placeholderTextColor="#777777"
          />

          <Text style={styles.searchIcon}>
            ⌕
          </Text>

        </View>

        {/* LISTA */}

        <View style={styles.list}>

          {items.map((item) => (

            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                cambiarSeleccion(item.id)
              }
            >

              {/* PORTADA */}

              <View style={styles.cover}>
                <Text style={styles.coverText}>
                  ONE{"\n"}PIECE
                </Text>
              </View>

              {/* INFORMACIÓN */}

              <Text style={styles.title}>
                {item.titulo}
              </Text>

              <Text style={styles.volume}>
                ▣ Tomo {item.tomo}
              </Text>

              <View style={styles.bottomRow}>

                <View style={styles.checkboxContainer}>

                  <View
                    style={[
                      styles.checkbox,
                      item.seleccionado &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {item.seleccionado && (
                      <Text style={styles.check}>
                        ✓
                      </Text>
                    )}
                  </View>

                  <Text style={styles.selectedText}>
                    {item.seleccionado
                      ? "Seleccionado"
                      : "No seleccionado"}
                  </Text>

                </View>

                <View style={styles.price}>
                  <Text style={styles.priceText}>
                    ${item.precio.toLocaleString("es-CO")}
                  </Text>
                </View>

              </View>

            </TouchableOpacity>

          ))}

        </View>

        {/* VER MÁS */}

        <TouchableOpacity>
          <Text style={styles.viewMore}>
            Ver más
          </Text>
        </TouchableOpacity>

        {/* PRESUPUESTO */}

        <View style={styles.budget}>

          <View>
            <Text style={styles.budgetTitle}>
              Presupuesto estimado
            </Text>

            <Text style={styles.budgetSubtitle}>
              {seleccionados} tomos
            </Text>
          </View>

          <View style={styles.budgetPrice}>
            <Text style={styles.budgetPriceText}>
              ${presupuesto.toLocaleString("es-CO")}
            </Text>
          </View>

        </View>

      </ScrollView>

      {/* NAVBAR */}

      <View style={styles.bottomNav}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/search")}
        >
          <Text style={styles.navIcon}>⌂</Text>
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.navIcon}>▮</Text>
          <Text style={styles.navText}>
            COLLECTION
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
        >
          <Text style={styles.navIconActive}>
            ♡
          </Text>

          <Text style={styles.navActive}>
            WISHLIST
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.navIcon}>♙</Text>
          <Text style={styles.navText}>PERFIL</Text>
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

  searchContainer: {
    height: 38,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#999999",
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

  list: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  card: {
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 9,
    padding: 8,
    marginBottom: 12,
  },

  cover: {
    height: 125,
    borderRadius: 6,
    backgroundColor: "#D9D9D9",
    alignItems: "center",
    justifyContent: "center",
  },

  coverText: {
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
    color: "#333333",
  },

  title: {
    fontSize: 12,
    fontWeight: "800",
    marginTop: 7,
  },

  volume: {
    fontSize: 9,
    color: "#555555",
    marginTop: 3,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 7,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    width: 13,
    height: 13,
    borderWidth: 1,
    borderColor: "#777777",
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#6338C9",
    borderColor: "#6338C9",
  },

  check: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },

  selectedText: {
    fontSize: 8,
    color: "#555555",
    marginLeft: 4,
  },

  price: {
    backgroundColor: "#222222",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 2,
  },

  priceText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },

  viewMore: {
    textAlign: "center",
    fontSize: 10,
    color: "#555555",
    marginVertical: 5,
  },

  budget: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#CCCCCC",
    borderRadius: 7,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  budgetTitle: {
    fontSize: 10,
    fontWeight: "700",
  },

  budgetSubtitle: {
    fontSize: 8,
    color: "#555555",
    marginTop: 2,
  },

  budgetPrice: {
    backgroundColor: "#222222",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 2,
  },

  budgetPriceText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
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

  navIconActive: {
    fontSize: 17,
    color: "#111111",
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