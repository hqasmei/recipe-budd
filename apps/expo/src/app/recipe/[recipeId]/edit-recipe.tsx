import React, { useState, useEffect, useLayoutEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useNavigation, useLocalSearchParams } from "expo-router";
import { Container } from "@/components/Container";
import * as ImagePicker from "expo-image-picker";
import { Input } from "@/components/ui/input";
import { Recipe } from "@/lib/types";
import { ImageIcon, Trash2, ChevronLeft } from "@/components/Icons";
import { cn } from "@/lib/utils";
const RECIPES_KEY = "recipes";

const recipeSchema = z.object({
  image: z.string().min(1, "An image is required"),
  recipeName: z.string().min(1, "Recipe name is required"),
  time: z.string().min(1, "Time is required"),
  ingredients: z.array(z.object({ detail: z.string().min(1) })),
  instructions: z.array(z.object({ step: z.string().min(1) })),
});

export default function EditRecipe() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const recipeId = params.recipeId; 

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      image: "",
      recipeName: "",
      time: "",
      ingredients: [{ detail: "" }],
      instructions: [{ step: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  useEffect(() => {
    const loadRecipe = async () => {
      const storedRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
      const storedRecipes = storedRecipesJSON
        ? JSON.parse(storedRecipesJSON)
        : [];
      const foundRecipe = storedRecipes.find(
        (recipe: any) => recipe.slug === recipeId
      );
      if (foundRecipe) {
        // Set form values
        reset({
          image: foundRecipe.image,
          recipeName: foundRecipe.recipeName,
          time: foundRecipe.time,
          ingredients: foundRecipe.ingredients,
          instructions: foundRecipe.instructions,
        });
      }
    };
    loadRecipe();
  }, [recipeId]);

  const onSubmit = async (data: any) => {
    const storedRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
    const storedRecipes = storedRecipesJSON
      ? JSON.parse(storedRecipesJSON)
      : [];
    const updatedRecipes = storedRecipes.map((recipe: any) =>
      recipe.slug === recipeId ? { ...recipe, ...data } : recipe
    );
    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    navigation.goBack();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera roll is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setValue("image", result.assets[0].uri); // Ensure you are setting the correct property
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions( {
      title: "Edit Recipe",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-3 flex flex-row items-center gap-1"
        >
          <ChevronLeft size={28} className="stroke-foreground" />
          <Text className="text-xl">Back</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-blue-500">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
 
  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex flex-1 flex-col">
          <View className="mb-2">
            <TouchableOpacity
              onPress={pickImage}
              className={cn(
                "mt-4 mx-4 flex h-48 flex-col items-center justify-center rounded-xl  border-muted-foreground  text-lg",
                getValues("image") === "" && "border border-dashed"
              )}
            >
              <Controller
                control={control}
                name="image"
                render={({ field: { value } }) =>
                  value ? (
                    <Image
                      source={{ uri: getValues("image") }}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                        borderRadius: 8,
                      }} // Adjust borderRadius as needed
                    />
                  ) : (
                    <>
                      <View>
                        <ImageIcon className="stroke-foreground" />
                      </View>
                      <View>
                        <Text
                          className="text-foreground"
                          style={{ fontFamily: "Quicksand-SemiBold" }}
                        >
                          Add Cover Image
                        </Text>
                      </View>
                    </>
                  )
                }
              />
            </TouchableOpacity>
            {errors.image && getValues("image") === "" && (
              <Text className="text-red-500 text-sm mt-2 px-4">
                {errors.image.message}
              </Text>
            )}
          </View>

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <View className="px-4 py-2">
                <Text
                  className="mb-1 text-foreground"
                  style={{ fontFamily: "Quicksand-SemiBold" }}
                >
                  Recipe Name
                </Text>
                <Input
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter recipe name"
                  className="flex h-10 w-full rounded-md  px-3 py-2"
                />
                {fieldState.error?.message && (
                  <Text className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            )}
            name="recipeName"
          />

          <Controller
            control={control}
            render={({ field: { onChange, value }, fieldState }) => (
              <View className="px-4 py-2">
                <Text
                  className="mb-1 text-foreground"
                  style={{ fontFamily: "Quicksand-SemiBold" }}
                >
                  Time
                </Text>
                <Input
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter cooking time"
                  className="flex h-10 w-full rounded-md  px-3 py-2"
                />
                {fieldState.error?.message && (
                  <Text className="text-red-500 text-sm mt-1">
                    {fieldState.error.message}
                  </Text>
                )}
              </View>
            )}
            name="time"
          />

          <View className="flex flex-1 flex-col px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Ingredients
            </Text>
            {ingredientFields.map((field, idx) => (
              <View key={idx} className="flex flex-row items-center py-2">
                <Controller
                  control={control}
                  name={`ingredients.${idx}.detail`} // Corrected field name
                  render={({ field, fieldState }) => (
                    <View className="flex-1">
                      <Input
                        onChangeText={field.onChange}
                        value={field.value}
                        placeholder="Enter ingredient details (e.g., 2 cups sugar)"
                        className="flex-1 h-10 rounded-md py-2"
                      />
                      {fieldState.error?.message && (
                        <Text className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
                <TouchableOpacity
                  onPress={() => removeIngredient(idx)}
                  className="ml-2 bg-danger p-2 rounded-md"
                >
                  <Trash2 size={20} className="stroke-red-500" />
                </TouchableOpacity>
              </View>
            ))}
            {ingredientFields.length > 1 && (
              <TouchableOpacity
                onPress={() => appendIngredient({ detail: "" })}
                className="my-2 flex items-center justify-center rounded-md bg-background border border-foreground/20 py-3"
              >
                <Text
                  className="text-foreground/50"
                  style={{ fontFamily: "Quicksand-Bold" }}
                >
                  Add Another Ingredient
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex flex-1 flex-col px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Instructions
            </Text>
            {instructionFields.map((field, idx) => (
              <View key={idx} className="flex flex-row items-center py-2">
                <Controller
                  control={control}
                  name={`instructions.${idx}.step`} // Corrected field name
                  render={({ field, fieldState }) => (
                    <View className="flex-1">
                      <Input
                        onChangeText={field.onChange}
                        value={field.value}
                        placeholder="Enter instruction details (e.g., Wash the potatoes)"
                        className="flex-1 h-10 rounded-md py-2"
                      />
                      {fieldState.error?.message && (
                        <Text className="text-red-500 text-sm mt-1">
                          {fieldState.error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
                {instructionFields.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeInstruction(idx)}
                    className="ml-2 bg-danger p-2 rounded-md"
                  >
                    <Trash2 size={20} className="stroke-red-500" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => appendInstruction({ step: "" })}
              className="my-2 flex items-center justify-center rounded-md border border-foreground/20 py-3"
            >
              <Text
                className="text-foreground/50"
                style={{ fontFamily: "Quicksand-Bold" }}
              >
                Add Another Step
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
