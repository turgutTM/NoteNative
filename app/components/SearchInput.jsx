import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (text) => {
    setValue(text);
    onSearch(text);
  };

  return (
    <View className="flex w-full flex-row items-center h-12 px-4 bg-black-100 rounded-2xl border border-black-200 focus:border-secondary">
      <TextInput
        className="text-sm items-center flex text-black flex-1 font-pregular"
        placeholder="Search a note"
        onChangeText={handleInputChange}
        placeholderTextColor="#CDCDE0"
        value={value}
      />
      <TouchableOpacity>
        <Icon name="search" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
