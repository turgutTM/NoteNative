import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const CreateFooter = ({ onAdd, onSave }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);

  const colors = ["#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#fb923c"];
  const categories = ["daily", "travel", "social"];

  const toggleColorPicker = () => {
    setIsColorPickerVisible(!isColorPickerVisible);
    setIsCategoryPickerVisible(false);
  };

  const toggleCategoryPicker = (category) => {
    setIsCategoryPickerVisible(!isCategoryPickerVisible);
    setIsColorPickerVisible(false);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onSave?.(undefined, undefined, color);
    setIsColorPickerVisible(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSave?.(undefined, undefined, undefined, category); 
    setIsCategoryPickerVisible(false);
  };
  
  return (
    <View className="relative px-7 mb-5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center"
            onPress={toggleColorPicker}
          >
            <Ionicons
              name={isColorPickerVisible ? "arrow-down" : "arrow-up"}
              size={24}
              color="black"
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center"
            onPress={toggleCategoryPicker}
          >
            <Ionicons
              name={
                isCategoryPickerVisible ? "copy-outline" : "duplicate-outline"
              }
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="border border-black rounded-full px-8 py-3"
          onPress={onAdd}
        >
          <Text>Add</Text>
        </TouchableOpacity>
      </View>

      {isColorPickerVisible && (
        <View className="absolute bottom-14 left-5 bg-white border border-black rounded-full w-15 z-10 p-2">
          {colors.map((color, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleColorSelect(color)}
              style={{
                backgroundColor: color,
                width: 34,
                height: 34,

                borderRadius: 20,
                marginBottom: 8,
                marginLeft: 2,
                borderWidth: 1,
                borderColor: "black",
                opacity: selectedColor === color ? 1 : 0.4,
              }}
            />
          ))}
        </View>
      )}

      {isCategoryPickerVisible && (
        <View className="absolute bottom-12 left-[53] rounded-lg w-fit z-10 p-2">
          {categories.map((cat, index) => {
            let iconName;
            if (cat === "daily") iconName = "calendar-outline";
            if (cat === "travel") iconName = "airplane-outline";
            if (cat === "social") iconName = "people-outline";
            return (
              <TouchableOpacity
                key={index}
                className="py-1"
                onPress={() => handleCategorySelect(cat)}
              >
                <View className="flex-row items-center border p-2 rounded-lg space-x-2">
                  <Ionicons name={iconName} size={18} color="black" />
                  <Text className="text-black">{cat}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default CreateFooter;
