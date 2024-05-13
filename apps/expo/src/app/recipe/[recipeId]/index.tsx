import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Stack,
  router,
  usePathname,
  useNavigation,
  Link,
  useFocusEffect,
} from "expo-router";
import { SquarePen, ChevronLeft, Clock4 } from "@/components/Icons";
import { useEffect, useState, useLayoutEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/Container";
import { type Recipe as RecipeType } from "@/lib/types";
import DeleteDialog from "@/components/DeleteDialog";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxStates {
  [key: string]: boolean;
}

export default function Recipe() {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const [recipe, setRecipe] = useState<RecipeType | null>(null);
  const [value, setValue] = useState("ingredients");
  const navigation = useNavigation();
  const [checkedIngredients, setCheckedIngredients] = useState<CheckboxStates>(
    {}
  );
  const [checkedInstructions, setCheckedInstructions] =
    useState<CheckboxStates>({});

  const handleIngredientChange = (key: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInstructionChange = (key: string) => {
    setCheckedInstructions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const fetchRecipe = useCallback(async () => {
    try {
      const storedRecipesJSON = await AsyncStorage.getItem("recipes");
      if (storedRecipesJSON) {
        const storedRecipes = JSON.parse(storedRecipesJSON) as RecipeType[];
        const foundRecipe = storedRecipes.find((item) => item.slug === id);
        setRecipe(foundRecipe as RecipeType);
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipe();
    }, [fetchRecipe])
  );

  useEffect(() => {
    if (recipe) {
      const ingredientChecks: CheckboxStates = {};
      const instructionChecks: CheckboxStates = {};

      recipe.ingredients.forEach((ingredient, index) => {
        ingredientChecks[`ingredient-${index}`] = false; // Initialize unchecked
      });

      recipe.instructions.forEach((instruction, index) => {
        instructionChecks[`instruction-${index}`] = false; // Initialize unchecked
      });

      setCheckedIngredients(ingredientChecks);
      setCheckedInstructions(instructionChecks);
    }
  }, [recipe]);

  useEffect(() => {
    const loadCheckboxStates = async () => {
      const savedIngredients = await AsyncStorage.getItem(`ingredients-${id}`);
      const savedInstructions = await AsyncStorage.getItem(
        `instructions-${id}`
      );
      if (savedIngredients) {
        setCheckedIngredients(JSON.parse(savedIngredients));
      }
      if (savedInstructions) {
        setCheckedInstructions(JSON.parse(savedInstructions));
      }
    };

    loadCheckboxStates();
  }, [id]);

  useEffect(() => {
    AsyncStorage.setItem(
      `ingredients-${id}`,
      JSON.stringify(checkedIngredients)
    );
    AsyncStorage.setItem(
      `instructions-${id}`,
      JSON.stringify(checkedInstructions)
    );
  }, [checkedIngredients, checkedInstructions, id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerBackTitleVisible: true,
      headerShadowVisible: false,
      headerTintColor: "black",
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => router.back()}
          className="-ml-3 flex flex-row items-center gap-1"
        >
          <ChevronLeft size={28} className="stroke-foreground" />
          <Text className="text-xl">Recipes</Text>
        </TouchableOpacity>
      ),
      headerRight: () => {
        return (
          <View className="flex flex-row items-center gap-3">
            {recipe && (
              <>
                <Link
                  asChild
                  href={{
                    pathname: "/recipe/[recipeId]/edit-recipe",
                    params: { recipeId: recipe?.slug },
                  }}
                >
                  <TouchableOpacity>
                    <SquarePen size={20} className="stroke-foreground" />
                  </TouchableOpacity>
                </Link>
                <DeleteDialog recipeId={recipe?.slug} />
              </>
            )}
          </View>
        );
      },
    });
  }, [navigation, recipe]);

  return (
    <Container>
      {recipe && (
        <ScrollView className="mt-4">
          <View className="mx-4 mb-1 flex h-48 flex-col items-center justify-center rounded-xl text-lg">
            <Image
              source={{ uri: recipe?.image }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
                borderRadius: 8,
              }}
            />
          </View>
          <View className="mx-4 mb-1">
            <Text
              className="text-3xl text-foreground"
              style={{ fontFamily: "Quicksand-SemiBold" }}
            >
              {recipe?.recipeName}
            </Text>
          </View>
          <View className="mx-4 flex flex-row items-center gap-2">
            <Clock4 size={16} className="stroke-2 stroke-foreground" />
            <Text
              className="text-lg text-foreground"
              style={{ fontFamily: "Quicksand-Regular" }}
            >
              {recipe.time}
            </Text>
          </View>

          <View className="mx-4 mt-4">
            <Tabs
              value={value}
              onValueChange={setValue}
              className="w-full max-w-[400px] flex-col gap-1.5 "
            >
              <TabsList className="flex-row w-full rounded-full bg-muted">
                <TabsTrigger
                  value="ingredients"
                  className="flex-1 shadow-none rounded-full py-2"
                >
                  <Text
                    className="text-foreground"
                    style={{ fontFamily: "Quicksand-SemiBold" }}
                  >
                    Ingredients
                  </Text>
                </TabsTrigger>
                <TabsTrigger
                  value="instructions"
                  className="flex-1 shadow-none rounded-full py-2"
                >
                  <Text
                    className="text-foreground"
                    style={{ fontFamily: "Quicksand-SemiBold" }}
                  >
                    Instructions
                  </Text>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="ingredients">
                <View className="flex flex-col gap-4 my-4 mx-2">
                  {recipe?.ingredients.map((ingredient, idx) => (
                    <View key={idx} className="flex flex-row items-start gap-4">
                      <Checkbox
                        checked={checkedIngredients[`ingredients-${idx}`]}
                        onCheckedChange={() =>
                          handleIngredientChange(`ingredients-${idx}`)
                        }
                        className="mt-[3px]"
                      />
                      <Text
                        className={cn(
                          "text-foreground text-xl flex-1",
                          checkedIngredients[`ingredients-${idx}`] &&
                            "line-through"
                        )}
                        style={{ fontFamily: "Quicksand-SemiBold" }}
                      >
                        {ingredient.detail}
                      </Text>
                    </View>
                  ))}
                </View>
              </TabsContent>

              <TabsContent value="instructions">
                <View className="flex flex-col gap-4 my-4 mx-2">
                  {recipe?.instructions.map((instruction, idx) => (
                    <View key={idx} className="flex flex-row items-start gap-4">
                      <Text className="text-xl">{idx + 1}.</Text>
                      <Text
                        className="text-foreground text-xl flex-1"
                        style={{ fontFamily: "Quicksand-SemiBold" }}
                      >
                        {instruction.step}
                      </Text>
                    </View>
                  ))}
                </View>
              </TabsContent>
            </Tabs>
          </View>
        </ScrollView>
      )}
    </Container>
  );
}
