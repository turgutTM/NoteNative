import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TuguPhoto from "../../assets/images/imageTugu.png";
import SearchInput from "../components/SearchInput";
import Note from "../components/Note";
import Icon from "react-native-vector-icons/Ionicons";
import { router, useNavigation } from "expo-router";
import { signOut } from "../../lib/appwrite";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "../components/Categories";
const Stack = createStackNavigator();
const Home = () => {
  const [isSlideBarOpen, setIsSlideBarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const [isWaving, setIsWaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const toggleSlideBar = () => {
    if (isSlideBarOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsSlideBarOpen(false));
    } else {
      setIsSlideBarOpen(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleLogout = async () => {
    setIsWaving(true);

    Animated.timing(waveAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(async () => {
      try {
        const result = await signOut();
        router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error.message);
      }
    });
  };

  const slideHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const waveTranslateY = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const waveOpacity = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="my-2 px-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-400">Welcome Back</Text>
            <Text className="text-2xl font-semibold">Good Morning</Text>
          </View>
          <View className="items-center">
            <Image source={TuguPhoto} className="w-10 h-10" />
            <TouchableOpacity onPress={toggleSlideBar}>
              <Icon
                name={isSlideBarOpen ? "chevron-up" : "chevron-down"}
                size={22}
                color="#000"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={{
            height: slideHeight,
            overflow: "hidden",
            backgroundColor: "#f2f2f2",
            borderRadius: 8,
            paddingHorizontal: 10,
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {isSlideBarOpen && (
            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center gap-1"
            >
              <Icon name="log-out-outline" size={20} color="red" />
              <Text className="text-black text-[15px]">Logout</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {isWaving && (
        <Animated.View
          style={{
            position: "absolute",
            top: "20%",
            left: "57%",
            transform: [{ translateX: -50 }, { translateY: waveTranslateY }],
            opacity: waveOpacity,
          }}
        >
          <Icon name="sad-outline" size={50} color="orange" />
        </Animated.View>
      )}

      <View className="px-3 mt-5">
        <SearchInput onSearch={setSearchQuery} />
      </View>
      <View className="px-3 mt-5">
        <Categories onCategorySelect={(cat) => setSelectedCategory(cat)} />
      </View>
      <View className="px-3 mt-5">
        <Note query={searchQuery} selectedCategory={selectedCategory} />
      </View>
    </SafeAreaView>
  );
};

export default Home;
