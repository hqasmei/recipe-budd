import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
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

const RECIPES_KEY = "recipes";

export default function EditRecipe() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const recipeId = params.recipeId;

  const [recipe, setRecipe] = useState(null);
  const [image, setImage] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  async function getPermissionAsync() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return false;
    }
    return true;
  }

  async function pickImage() {
    const hasPermission = await getPermissionAsync();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Image picking was canceled.");
    }
  }

  const handleSave = async () => {
    const storedRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
    const storedRecipes = storedRecipesJSON
      ? JSON.parse(storedRecipesJSON)
      : [];
    const updatedRecipes = storedRecipes.map((recipe: Recipe) =>
      recipe.slug === recipeId
        ? { ...recipe, recipeName, time, ingredients, instructions, image }
        : recipe
    );

    await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    navigation.goBack(); // or use navigation to redirect to the recipe detail page
  };
  const handleIngredientChange = ({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) => {
    const updatedIngredients = ingredients.map((item, i) =>
      i === index ? value : item
    );
    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleInstructionChange = ({
    value,
    index,
  }: {
    value: string;
    index: number;
  }) => {
    const updatedInstructions = instructions.map((step, i) =>
      i === index ? value : step
    );
    setInstructions(updatedInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const loadRecipe = async () => {
      const storedRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
      const storedRecipes = storedRecipesJSON
        ? JSON.parse(storedRecipesJSON)
        : [];
      const foundRecipe = storedRecipes.find(
        (recipe: Recipe) => recipe.slug === recipeId
      );
      if (foundRecipe) {
        setRecipe(foundRecipe);
        setRecipeName(foundRecipe.recipeName);
        setTime(foundRecipe.time);
        setIngredients(foundRecipe.ingredients);
        setInstructions(foundRecipe.instructions);
        setImage(foundRecipe.image);
      }
    };

    if (recipeId) {
      loadRecipe();
    }
  }, [recipeId]); // Re-run the effect if recipeId changes

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Recipe",
      headerBackTitleVisible: true,
      headerShadowVisible: false,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-3 flex flex-row items-center gap-1"
        >
          <ChevronLeft size={28} className="stroke-foreground" />
          <Text className="text-xl">Back</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, recipe]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex flex-1 flex-col">
          {/* Image Picker for Recipe */}
          <TouchableOpacity
            onPress={pickImage}
            className="m-4 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground text-lg"
          >
            {image ? (
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: 8,
                }}
              />
            ) : (
              <>
                <View className="mb-4">
                  <ImageIcon className="stroke-foreground" />
                </View>
                <Text
                  className="text-foreground"
                  style={{ fontFamily: "Quicksand-SemiBold" }}
                >
                  Add Cover Image
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Input for Recipe Name */}
          <View className="px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Recipe Name
            </Text>
            <Input
              onChangeText={setRecipeName}
              value={recipeName}
              placeholder="Enter recipe name"
              className="flex h-10 w-full rounded-md px-3 py-2"
            />
          </View>

          {/* Input for Cooking Time */}
          <View className="px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Time
            </Text>
            <Input
              onChangeText={setTime}
              value={time}
              placeholder="Enter cooking time"
              className="flex h-10 w-full rounded-md px-3 py-2"
            />
          </View>

          {/* Ingredients List */}
          <View className="flex flex-1 flex-col px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Ingredients
            </Text>
            {ingredients.map((ingredient, index) => (
              <View key={index} className="flex flex-row items-center py-2">
                <Input
                  onChangeText={(text) =>
                    handleIngredientChange({ value: text, index })
                  }
                  value={ingredient}
                  placeholder="Enter ingredient details (e.g., 2 cups sugar)"
                  className="flex-1 h-10 rounded-md py-2"
                />
                {ingredients.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeIngredient(index)}
                    className="ml-2 bg-danger p-2 rounded-md"
                  >
                    <Trash2 size={20} className="stroke-red-500" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={addIngredient}
              className="my-2 flex items-center justify-center rounded-md bg-background border border-foreground/20 py-3"
            >
              <Text
                className="text-foreground/50"
                style={{ fontFamily: "Quicksand-Bold" }}
              >
                Add Another Ingredient
              </Text>
            </TouchableOpacity>
          </View>

          {/* Instructions List */}
          <View className="flex flex-1 flex-col px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Instructions
            </Text>
            {instructions.map((instruction, index) => (
              <View key={index} className="flex flex-row items-center py-2">
                <Input
                  onChangeText={(text) =>
                    handleInstructionChange({ value: text, index })
                  }
                  value={instruction}
                  placeholder="Enter instruction details (e.g., Wash the potatoes)"
                  className="flex-1 h-10 rounded-md py-2"
                />
                {instructions.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeInstruction(index)}
                    className="ml-2 bg-danger p-2 rounded-md"
                  >
                    <Trash2 size={20} className="stroke-red-500" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={addInstruction}
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

          {/* Save Button */}
          <View className="px-4 py-2">
            <TouchableOpacity
              onPress={handleSave}
              className="flex w-full items-center justify-center rounded-md bg-foreground py-3"
            >
              <Text
                className="text-muted"
                style={{ fontFamily: "Quicksand-Bold" }}
              >
                Save Recipe
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
