import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getUserNotes } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useFocusEffect } from "@react-navigation/native";
import NoNotes from "../../assets/images/NoNotes.png";
import { getImagePreview } from "../../lib/appwrite";

const Note = ({ query, selectedCategory }) => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState({});

  const getIconName = (category) => {
    switch (category) {
      case "daily":
        return "calendar-outline";
      case "travel":
        return "airplane-outline";
      case "social":
        return "people-outline";
      default:
        return "apps-outline";
    }
  };

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const fetchedNotes = await getUserNotes(user?.$id);
      setNotes(fetchedNotes);

      const urlsMap = {};
      for (let note of fetchedNotes) {
        if (note.image) {
          const previewUrl = await getImagePreview(note.image);
          urlsMap[note.$id] = previewUrl;
        }
      }
      setImageUrls(urlsMap);
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

  const filteredNotes = notes.filter((note) => {
    const matchesQuery = note.title.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || note.category === selectedCategory;

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
      <View className="flex flex-col justify-center items-center ">
        <Text className="text-xl font-bold text-gray-600 mb-4">
          Create your first note!
        </Text>
        <TouchableOpacity
          onPress={handleCreateNote}
          className="bg-white items-center justify-center px-2 py-1 gap-1 border-black flex rounded-full flex-row "
        >
          <Ionicons name="add-circle-outline" size={25} />
          <Text className="text-black border rounded-full px-2  text-base text-center font-medium">
            Create
          </Text>
        </TouchableOpacity>
        <View>
          <Image source={NoNotes} className="w-40 h-40" />
        </View>
      </View>
    );
  }

  const renderNote = ({ item: note, index }) => {
    if (note.content.length > 500) {
      return (
        <TouchableOpacity
          key={note.$id}
          className="w-full bg-white shadow-lg p-4 mb-4 rounded-2xl"
          style={{ borderColor: note.borderColor, borderWidth: 2 }}
          onPress={() => handleNotePress(note.$id)}
        >
          <Text className="text-lg font-bold text-gray-800 mb-2">
            {note.title}
          </Text>

          <Text className="text-gray-600 mb-3">
            {note.content.substring(0, 200)}...
          </Text>
          <Text className="text-xs text-gray-500 text-right">
            {formatDate(note.createdAt)}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={note.$id}
        className={`w-full bg-white shadow-lg p-4 mb-4 ${
          index % 2 === 0
            ? "h-[5rem]   rounded-tr-xl rounded-bl-3xl"
            : "h-[5rem] rounded-tl-2xl rounded-br-4xl"
        }`}
        style={{ borderColor: note.borderColor, borderWidth: 2 }}
        onPress={() => handleNotePress(note.$id)}
      >
        <Ionicons
          name={getIconName(note.category)}
          size={24}
          color="gray"
          className=""
        />

        <Text className="text-lg font-bold text-gray-800 mb-2 mt-2">
          {note.title}
        </Text>
        <Text className="text-gray-600 mb-3">
          {note.content.substring(0, 60)}...
        </Text>
        <Text className="text-xs text-gray-500 text-right">
          {formatDate(note.createdAt)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={filteredNotes}
      renderItem={renderNote}
      keyExtractor={(item) => item.$id}
      numColumns={1}
      contentContainerStyle={{
        paddingBottom: 200,
        paddingHorizontal: 8,
      }}
    />
  );
};

export default Note;
