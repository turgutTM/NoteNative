import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const CreateFooter = ({ onAdd, onSave }) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryPickerVisible, setIsCategoryPickerVisible] = useState(false);
  const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);

  const colors = ["#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6", "#fb923c"];
  const categories = ["daily", "travel", "social"];

  const toggleColorPicker = () => {
    setIsColorPickerVisible(!isColorPickerVisible);
    setIsCategoryPickerVisible(false);
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    onSave?.(undefined, undefined, color);
    setIsColorPickerVisible(false);
  };
  const toggleCategoryPicker = () => {
    setIsCategoryPickerVisible(!isCategoryPickerVisible);
    setIsColorPickerVisible(false);
  };
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSave?.(undefined, undefined, undefined, category);
    setIsCategoryPickerVisible(false);
  };

  const togglePhotoPicker = () => {
    setIsPhotoPickerVisible(!isPhotoPickerVisible);
    setIsColorPickerVisible(false);
    setIsCategoryPickerVisible(false);
  };

  const handleChooseFromLibrary = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      onSave?.(undefined, undefined, undefined, undefined, result.assets[0].uri); 
      setIsPhotoPickerVisible(false);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to allow access to your camera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      onSave?.(result.assets[0].uri);
      setIsPhotoPickerVisible(false);
    }
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
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-300 items-center justify-center"
            onPress={togglePhotoPicker}
          >
            <Ionicons name="image-outline" size={24} color="black" />
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

      {isPhotoPickerVisible && (
        <View className="absolute bottom-12 left-16 gap-2 shadow-lg rounded-lg p-2">
          <TouchableOpacity
            onPress={handleChooseFromLibrary}
            className="py-2 flex border items-center px-1 rounded-2xl flex-row gap-1"
          >
            <Ionicons name="library-outline" color="black" size={20} />
            <Text className="text-black">Choose from Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="py-2 border px-1 rounded-2xl flex flex-row items-center gap-1"
          >
            <Ionicons name="camera-outline" color="black" size={20} />
            <Text className="text-black text-base">Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default CreateFooter;
