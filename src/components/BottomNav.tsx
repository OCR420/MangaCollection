
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  active: "home" | "collection" | "wishlist" | "profile";
};

export default function BottomNav({ active }: Props) {
  const opciones = [
    { id: "home", icono: "⌂", nombre: "HOME", ruta: "/search" },
    { id: "collection", icono: "▮", nombre: "COLLECTION", ruta: "/home" },
    { id: "wishlist", icono: "♡", nombre: "WISHLIST", ruta: "/wishlist" },
    { id: "profile", icono: "♙", nombre: "PERFIL", ruta: "/profile" },
  ] as const;

  return (
    <View style={styles.bottomNav}>
      {opciones.map((opcion) => {
        const seleccionado = active === opcion.id;

        return (
          <TouchableOpacity
            key={opcion.id}
            style={styles.navItem}
            onPress={() => {
              if (!seleccionado) {
                router.push(opcion.ruta as any);
              }
            }}
          >
            <Text
              style={seleccionado ? styles.navIconActive : styles.navIcon}
            >
              {opcion.icono}
            </Text>

            <Text
              style={seleccionado ? styles.navActive : styles.navText}
            >
              {opcion.nombre}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
