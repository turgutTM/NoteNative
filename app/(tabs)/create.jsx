import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useRouter } from "expo-router";
import CreateFooter from "../components/CreateFooter";
import TitleContent from "../components/TitleContent";
import { createNote } from "../../lib/appwrite";
import { Ionicons } from "@expo/vector-icons";

const Create = () => {
  const { user, setUser } = useGlobalContext();
  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    borderColor: "",
    category: "",
  });
  const router = useRouter();
  console.log(noteData);

  const handleSave = (title, content, borderColor, category) => {
    setNoteData((prevData) => ({
      ...prevData,
      title: title || prevData.title,
      content: content || prevData.content,
      borderColor: borderColor || prevData.borderColor,
      category: category || prevData.category,
    }));
  };

  const handleAdd = async () => {
    try {
      const { title, content, borderColor, category } = noteData;

      if (!title || !content) {
        console.error("Title and content are required");
        return;
      }

      await createNote(user?.$id, title, content, borderColor, category);

      router.push("/home");
    } catch (error) {
      console.error("Error creating note:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg font-medium ml-2">Back</Text>
        </TouchableOpacity>
        <TitleContent
          onSave={(title, content) => handleSave(title, content, undefined)}
        />
        <CreateFooter
          onSave={(title, content, borderColor, category) =>
            handleSave(undefined, undefined, borderColor, category)
          }
          onAdd={handleAdd}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
