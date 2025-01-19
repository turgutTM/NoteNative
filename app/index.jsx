import React, { useEffect } from "react";
import { StyleSheet, View, Image, Animated } from "react-native";
import { useRouter, Redirect } from "expo-router";

import TuguPhoto from "../assets/images/imageTugu.png";
import { useGlobalContext } from "../context/GlobalProvider";

const App = () => {
  const { loading, isLogged } = useGlobalContext();
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

  
    const timeout = setTimeout(() => {
      if (!loading && isLogged) {
        router.push("/home");
      }else {
        router.push("/login")
      }
    }, 2000);

    return () => clearTimeout(timeout); 
  }, [loading, isLogged, router]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image source={TuguPhoto} style={styles.logo} />
      </Animated.View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
