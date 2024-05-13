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

import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
const RECIPES_KEY = "recipes";

const recipeSchema = z.object({
  image: z.string().min(1, "An image is required"),
  recipeName: z.string().min(1, "Recipe name is required"),
  time: z.string().min(1, "Time is required"),
  ingredients: z.array(
    z.object({
      detail: z.string().min(1, "Ingredient detail is required"),
    })
  ),
  instructions: z.array(
    z.object({
      step: z.string().min(1, "Instruction step is required"),
    })
  ),
});

type RecipeForm = {
  image: string;
  recipeName: string;
  time: string;
  ingredients: Array<{ detail: string }>;
  instructions: Array<{ step: string }>;
};

export default function AddRecipe() {
  const [image, setImage] = useState("");
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecipeForm>({
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

  const navigation = useNavigation();

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
    }
  }

  const createSlug = (name: string, existingRecipes: any[]): string => {
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

  const onSubmit: SubmitHandler<RecipeForm> = async (data) => {
    const existingRecipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
    const existingRecipes: RecipeForm[] = existingRecipesJSON
      ? JSON.parse(existingRecipesJSON)
      : [];
    const image = data.image;
    const recipeName = data.recipeName;
    const time = data.time;
    const ingredients = data.ingredients;
    const instructions = data.instructions;
    const slug = createSlug(recipeName, existingRecipes);
    const newRecipe = {
      image,
      recipeName,
      time,
      ingredients,
      instructions,
      slug,
    };

    await AsyncStorage.setItem(
      RECIPES_KEY,
      JSON.stringify([...existingRecipes, newRecipe])
    );

    reset();
    navigation.goBack();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-foreground">Cancel</Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text className="text-blue-500">Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, onSubmit]);

  return (
    <Container>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 70 : 0}
      >
        <ScrollView className="flex flex-1 flex-col">
          <View className="mb-2">
            <TouchableOpacity
              onPress={pickImage}
              className={cn(
                "mt-4 mx-4 flex h-48 flex-col items-center justify-center rounded-xl  border-muted-foreground  text-lg",
                image === "" && "border border-dashed"
              )}
            >
              {image === "" ? (
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
            {errors.image && image === "" && (
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
            {ingredientFields.map((field, index) => (
              <View key={field.id} className="flex flex-row items-center py-2">
                <Controller
                  control={control}
                  name={`ingredients.${index}.detail`} // Corrected field name
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
                {ingredientFields.length > 1 && (
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
          </View>

          <View className="flex flex-1 flex-col px-4 py-2">
            <Text
              className="mb-1 text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              Instructions
            </Text>
            {instructionFields.map((field, index) => (
              <View key={field.id} className="flex flex-row items-center py-2">
                <Controller
                  control={control}
                  name={`instructions.${index}.step`} // Corrected field name
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
                    onPress={() => removeInstruction(index)}
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
