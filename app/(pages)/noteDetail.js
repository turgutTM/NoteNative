import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { deleteNote, updateNote } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const NoteDetail = () => {
  const { user } = useGlobalContext();
  const route = useRoute();
  const navigation = useNavigation();
  const { title, content, noteId } = route.params;

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedContent, setUpdatedContent] = useState(content);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteNote(noteId, user.$id);
      navigation.goBack();
    } catch (error) {
      console.error("Failed to delete note:", error);
      alert("Failed to delete note");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedNote = await updateNote(noteId, user.$id, {
        title: updatedTitle,
        content: updatedContent,
      });
      setIsEditing(false);
      setUpdatedTitle(updatedNote.title);
      setUpdatedContent(updatedNote.content);
    } catch (error) {
      console.error("Failed to update note:", error);
      alert("Failed to update note");
    }
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Notifications blocked");
      return false;
    }
    return true;
  };

  const scheduleNotificationForDate = async (date) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Reminder!",
        body: `${updatedTitle}"`,
        sound: true,
      },
      trigger: date,
    });

    alert("Timer set perfectly");
  };

  const handleDatePickerConfirm = (date) => {
    scheduleNotificationForDate(date);
    setIsDatePickerVisible(false);
  };

  const handleDatePickerCancel = () => {
    setIsDatePickerVisible(false);
  };

  const handleScheduleReminder = () => {
    setIsDatePickerVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-4 bg-white">
        <View
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={28} color="black" />
          </TouchableOpacity>
          <Text className="text-[17px]">Back</Text>
        </View>

        {isEditing && (
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              zIndex: 10,
            }}
            onPress={handleSaveEdit}
          >
            <Ionicons name="checkmark-outline" size={28} color="green" />
          </TouchableOpacity>
        )}

        <View className="mt-16 flex-1">
          {isEditing ? (
            <>
              <TextInput
                className="text-4xl font-bold mb-4"
                value={updatedTitle}
                onChangeText={setUpdatedTitle}
                placeholder="Edit title"
              />
              <TextInput
                className="text-gray-500 text-[17px]"
                value={updatedContent}
                onChangeText={setUpdatedContent}
                placeholder="Edit content"
                multiline
              />
            </>
          ) : (
            <>
              <Text className="text-4xl font-bold mb-4">{updatedTitle}</Text>
              <Text className="text-gray-500 text-[17px]">
                {updatedContent}
              </Text>
            </>
          )}
        </View>

        {!isEditing && (
          <View
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              flexDirection: "row",
              gap: 16,
            }}
          >
            <TouchableOpacity
              className="bg-white border rounded-full w-12 h-12 items-center justify-center"
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil-outline" size={28} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white border rounded-full w-12 h-12 items-center justify-center"
              onPress={handleDelete}
            >
              <Ionicons name="trash-outline" size={28} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white border rounded-full w-12 h-12 items-center justify-center"
              onPress={handleScheduleReminder}
            >
              <Ionicons name="time-outline" size={28} color="black" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleDatePickerConfirm}
        onCancel={handleDatePickerCancel}
      />
    </SafeAreaView>
  );
};

export default NoteDetail;
