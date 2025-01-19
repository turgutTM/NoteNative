import React, { useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Categories = ({ onCategorySelect }) => {
  const categories = ["all", "daily", "travel", "social"];
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onCategorySelect?.(category); 
  };

  return (
    <View className="flex-row justify-between items-center px-2 py-2">
      {categories.map((cat, index) => {
        let iconName;
        if (cat === "all") iconName = "apps-outline";
        if (cat === "daily") iconName = "calendar-outline";
        if (cat === "travel") iconName = "airplane-outline";
        if (cat === "social") iconName = "people-outline";

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategorySelect(cat)}
            className="mx-2"
          >
            <View
              className={`flex-row items-center border p-2 rounded-lg space-x-2 ${
                selectedCategory === cat
                  ? "bg-blue-500 border-blue-600"
                  : "border-gray-300"
              }`}
            >
              <Ionicons
                name={iconName}
                size={18}
                color={selectedCategory === cat ? "white" : "black"}
              />
              <Text
                className={`${
                  selectedCategory === cat ? "text-white" : "text-black"
                }`}
              >
                {cat}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Categories;
