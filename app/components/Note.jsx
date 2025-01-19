// Note.js
import React, { useState, useEffect, useCallback } from "react";
import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getUserNotes } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import NoNotes from "../../assets/images/NoNotes.png";

const Note = ({ query, selectedCategory }) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const fetchedNotes = await getUserNotes(user?.$id);
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // 1) Arama filtresi
  // 2) Kategori filtresi
  // all seçiliyse tüm notlar gelir.
  const filteredNotes = notes.filter((note) => {
    // Arama sorgusu
    const matchesQuery = note.title.toLowerCase().includes(query.toLowerCase());
    // Kategori kontrolü
    const matchesCategory =
      selectedCategory === "all" || note.category === selectedCategory;

    // İki şartı da sağlarsa ekle
    return matchesQuery && matchesCategory;
  });

  const handleCreateNote = () => {
    router.push({
      pathname: "/create",
      params: { animationType: "slide" },
    });
  };

  const handleNotePress = (noteId) => {
    const selectedNote = notes.find((note) => note.$id === noteId);
    router.push({
      pathname: "/noteDetail",
      params: {
        title: selectedNote.title,
        noteId: noteId,
        content: selectedNote.content,
        createdAt: selectedNote.createdAt,
      },
    });
  };

  if (loading) {
    return (
      <View className="flex justify-center items-center h-full">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (filteredNotes.length === 0) {
    return (
      <View className="flex flex-col justify-center items-center h-[89%]">
        <Text className="text-xl font-bold text-gray-600 mb-4">
          Create your first note!
        </Text>
        <TouchableOpacity
          onPress={handleCreateNote}
          className="bg-white border gap-1 border-black flex rounded-full px-4 py-1 flex-row justify-center items-center"
        >
          <Ionicons name="add-circle-outline" size={20} />
          <Text className="text-black text-base text-center font-medium">
            Create
          </Text>
        </TouchableOpacity>
        <View>
          <Image source={NoNotes} className="w-40 h-40" />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      {filteredNotes.map((note) => (
        <TouchableOpacity
          key={note.$id}
          className="w-44 h-48 rounded-2xl p-3 relative mb-5"
          style={{ borderColor: note.borderColor, borderWidth: 2 }}
          onPress={() => handleNotePress(note.$id)}
        >
          <View>
            <Text className="text-xl font-bold">{note.title}</Text>
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-gray-500">
              {note.content.substring(0, 80)}...
            </Text>
          </View>
          <Text className="text-xs text-gray-700 absolute bottom-2 right-2">
            {formatDate(note.createdAt)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Note;
