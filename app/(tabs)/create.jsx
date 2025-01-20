import React, { useState } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import CreateFooter from "../components/CreateFooter";
import TitleContent from "../components/TitleContent";
import { createNote, uploadImage } from "../../lib/appwrite";

const Create = () => {
  const { user } = useGlobalContext();
  const router = useRouter();

  const [noteData, setNoteData] = useState({
    title: "",
    content: "",
    borderColor: "",
    category: "",
    imageFileId: "",
  });

  console.log("Note Data:", noteData);

  const handleSave = (title, content, borderColor, category, imageFileId) => {
    setNoteData((prevData) => ({
      ...prevData,
      title: title !== undefined ? title : prevData.title,
      content: content !== undefined ? content : prevData.content,
      borderColor:
        borderColor !== undefined ? borderColor : prevData.borderColor,
      category: category !== undefined ? category : prevData.category,
      imageFileId:
        imageFileId !== undefined ? imageFileId : prevData.imageFileId,
    }));
  };

  const handleAdd = async () => {
    try {
      const { title, content, borderColor, category, imageFileId } = noteData;

      if (!title || !content) {
        console.error("Title and content are required");
        return;
      }

      await createNote(
        user?.$id,
        title,
        content,
        borderColor,
        category,
        imageFileId
      );
      setNoteData({
        title: "",
        content: "",
        borderColor: "",
        category: "",
        imageFileId: "",
      });

      router.push("/home");
    } catch (error) {
      console.error("Error creating note:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <TouchableOpacity
          className="flex-row items-center p-4"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
          <Text className="text-lg font-medium ml-2">Back</Text>
        </TouchableOpacity>

        <TitleContent
          title={noteData.title}
          content={noteData.content}
          onTitleChange={(newTitle) => handleSave(newTitle, undefined)}
          onContentChange={(newContent) => handleSave(undefined, newContent)}
        />

        <CreateFooter
          onSave={(title, content, borderColor, category, imageFileId) =>
            handleSave(undefined, undefined, borderColor, category, imageFileId)
          }
          onAdd={handleAdd}
        />
      </View>
    </SafeAreaView>
  );
};

export default Create;
