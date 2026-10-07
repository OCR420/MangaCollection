import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

export default function ProfileScreen() {

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
            PERFIL
          </Text>

          <View style={styles.logo}>
            <Text style={styles.logoText}>M</Text>
          </View>

        </View>

        {/* AVATAR */}

        <View style={styles.avatarContainer}>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              A
            </Text>
          </View>

        </View>

        {/* NOMBRE */}

        <View style={styles.nameRow}>

          <Text style={styles.name}>
            Andres
          </Text>

          <Text style={styles.viewAll}>
            View all
          </Text>

        </View>

        {/* EMAIL */}

        <View style={styles.emailBox}>
          <Text style={styles.email}>
            andres123@gmail.com
          </Text>
        </View>

        {/* DETALLES */}

        <Text style={styles.sectionTitle}>
          Detalles
        </Text>

        {/* MANGAS */}

        <View style={styles.detailCard}>

          <Text style={styles.detailIcon}>
            ▣
          </Text>

          <Text style={styles.detailLabel}>
            Mangas:
          </Text>

          <Text style={styles.detailValue}>
            15
          </Text>

        </View>

        {/* TOMOS */}

        <View style={styles.detailCard}>

          <Text style={styles.detailIcon}>
            ▪
          </Text>

          <Text style={styles.detailLabel}>
            Tomos:
          </Text>

          <Text style={styles.detailValue}>
            120
          </Text>

        </View>

        {/* PROGRESO */}

        <View style={styles.detailCard}>

          <Text style={styles.detailIcon}>
            ☆
          </Text>

          <Text style={styles.detailLabel}>
            Progreso general:
          </Text>

          <Text style={styles.detailValue}>
            65%
          </Text>

        </View>

        {/* CERRAR SESIÓN */}

        <TouchableOpacity
          style={styles.logout}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.logoutText}>
            Cerrar sesión
          </Text>
        </TouchableOpacity>

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
        >
          <Text style={styles.navIconActive}>
            ♙
          </Text>

          <Text style={styles.navActive}>
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

  avatarContainer: {
    marginHorizontal: 20,
    height: 145,
    backgroundColor: "#CCCCCC",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E8E8E8",
    borderWidth: 2,
    borderColor: "#AAAAAA",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#555555",
  },

  nameRow: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "800",
  },

  viewAll: {
    fontSize: 9,
    color: "#666666",
  },

  emailBox: {
    height: 38,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 18,
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  email: {
    fontSize: 10,
    color: "#555555",
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: "800",
  },

  detailCard: {
    height: 58,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: "#AAAAAA",
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  detailIcon: {
    fontSize: 22,
    color: "#999999",
    width: 40,
  },

  detailLabel: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
  },

  detailValue: {
    fontSize: 12,
    fontWeight: "800",
  },

  logout: {
    marginHorizontal: 20,
    marginTop: 8,
    height: 40,
    backgroundColor: "#111111",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 10,
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