import React, { useState } from "react";
import {
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";

const TitleContent = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isContent, setIsContent] = useState(false);

  const handleTextChange = (value) => {
    if (value.includes("\n") && !isContent) {
      setIsContent(true);
    }

    const splitText = value.split("\n");
    const newTitle = splitText[0];
    const newContent = splitText.slice(1).join("\n");

    setTitle(newTitle);
    setContent(newContent);

    onSave(newTitle, newContent);
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
          autoFocus={!isContent}
          onChangeText={handleTextChange}
          placeholder="Title"
          placeholderTextColor="gray"
          style={{ paddingVertical: 0 }}
        />

        {isContent && (
          <TextInput
            className="text-[17px] mt-4 font-light text-black"
            value={content}
            multiline
            autoFocus={isContent}
            onChangeText={(contentText) => {
              setContent(contentText);
              onSave(title, contentText);
            }}
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
