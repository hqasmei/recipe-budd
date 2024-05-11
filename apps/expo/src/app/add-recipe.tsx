import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "expo-router";
import { ImageIcon, Trash2 } from "@/components/Icons";
import { useState, useLayoutEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/Container";
import { type Recipe } from "@/lib/types";

const RECIPES_KEY = "recipes";

export default function AddRecipe() {
  const [image, setImage] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [time, setTime] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const navigation = useNavigation();

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

  const createSlug = (name: string, existingRecipes: Recipe[]): string => {
    let slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "");
    let uniqueSlug = slug;
    let counter = 1;
    while (existingRecipes.some((recipe) => recipe.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    return uniqueSlug;
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

  const handleSave = async (): Promise<void> => {
    const existingRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
    const existingRecipes: Recipe[] = existingRecipesJSON
      ? JSON.parse(existingRecipesJSON)
      : [];
    const slug = createSlug(recipeName, existingRecipes);
    const newRecipe: Recipe = {
      image,
      recipeName,
      time,
      ingredients,
      instructions,
      slug,
    };
    console.log(newRecipe);
    // await AsyncStorage.setItem(
    //   RECIPES_KEY,
    //   JSON.stringify([...existingRecipes, newRecipe])
    // );

    // setImage("");
    // setRecipeName("");
    // setTime("");
    // setIngredients([]);
    // setInstructions([]);
    // navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSave}>
          <Text className="text-blue-500">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView className="flex flex-1 flex-col">
          <TouchableOpacity
            onPress={pickImage}
            className="m-4 flex h-48 flex-col items-center justify-center rounded-xl  border border-dashed border-muted-foreground  text-lg"
          >
            {image === "" ? (
              <>
                <View className="mb-4">
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
            ) : (
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: 8,
                }} // Adjust borderRadius as needed
              />
            )}
          </TouchableOpacity>
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
              className="flex h-10 w-full rounded-md  px-3 py-2"
            />
          </View>
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
              className="flex h-10 w-full rounded-md  px-3 py-2"
            />
          </View>

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
                  placeholder={`Enter instruction details (e.g., Wash the potatoes`}
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
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
}
