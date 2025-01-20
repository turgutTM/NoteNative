import React from "react";
import {
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const TitleContent = ({ title, content, onTitleChange, onContentChange }) => {
  const handleTextChange = (value) => {
    const splitText = value.split("\n");
    const newTitle = splitText[0];
    const newContent = splitText.slice(1).join("\n");

    onTitleChange(newTitle);
    onContentChange(newContent);
  };

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View className="flex-1 p-4">
        <TextInput
          className="text-4xl font-bold text-black"
          value={title}
          multiline
          autoFocus={!content}
          onChangeText={handleTextChange}
          placeholder="Title"
          placeholderTextColor="gray"
          style={{ paddingVertical: 0 }}
        />

        {content !== undefined && (
          <TextInput
            className="text-[17px] mt-4 font-light text-black"
            value={content}
            multiline
            onChangeText={onContentChange}
            placeholder="Content"
            placeholderTextColor="gray"
            style={{ paddingVertical: 0 }}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TitleContent;
