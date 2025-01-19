import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const PageLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="noteDetail"
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
};

export default PageLayout;

const styles = StyleSheet.create({});
