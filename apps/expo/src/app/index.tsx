import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router, useFocusEffect } from "expo-router";
import { Clock4, Plus } from "@/components/Icons";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useLayoutEffect } from "react";
import { Container } from "@/components/Container";
import { type Recipe } from "@/lib/types";
const RECIPES_KEY = "recipes";
import { useNavigation } from "expo-router";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const navigation = useNavigation();
  const fetchRecipes = async () => {
    try {
      const recipesJSON = await AsyncStorage.getItem(RECIPES_KEY);
      if (recipesJSON) {
        const storedRecipes = JSON.parse(recipesJSON);
        setRecipes(storedRecipes);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  };

  const handleFilter = (searchTerm: string) => {
    setRecipes(
      recipes.filter((recipe) =>
        recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  useEffect(() => {
    // Fetch recipes when component mounts
    fetchRecipes();
    // clearStorage();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search Recipes",
        onChangeText: (event: any) => {
          handleFilter(event.nativeEvent.text);
        },
      },
    });
  }, [navigation]);
 
  return (
    <>
      <Container>
        <View>
          <ScrollView
            contentContainerStyle={{ alignItems: "center" }}
            className="relative flex h-full flex-col"
          >
            {recipes.length === 0 ? (
              <View className="mt-[40%] flex w-full items-center">
                <Text
                  className="text-balance px-[25%] text-center text-2xl text-neutral-500"
                  style={{ fontFamily: "Quicksand-SemiBold" }}
                >
                  You haven't added any recipes yet
                </Text>
              </View>
            ) : (
              <View className="flex w-full flex-col items-center justify-center gap-4 ">
                {recipes.map((recipe: Recipe, idx: number) => {
                  const recipeId = recipe.slug;
                  return (
                    <View key={idx} className="w-full">
                      <Pressable
                        onPress={() =>
                          router.push(`/recipe/${recipeId}` as any)
                        }
                      >
                        <View className="mx-4 mb-1 flex h-48 flex-col items-center justify-center rounded-xl bg-neutral-100   text-lg">
                          <Image
                            source={{ uri: recipe.image }}
                            style={{
                              width: "100%",
                              height: "100%",
                              resizeMode: "cover",
                              borderRadius: 8,
                            }} // Adjust borderRadius as needed
                          />
                        </View>

                        <View className="mx-4 flex flex-row items-end justify-between">
                          <Text
                            className="text-xl text-foreground"
                            style={{ fontFamily: "Quicksand-SemiBold" }}
                          >
                            {recipe.recipeName}
                          </Text>
                          <View className="flex flex-row items-center gap-2">
                            <Clock4
                              size={14}
                              className="stroke-2 stroke-foreground"
                            />
                            <Text className="text-foreground">
                              {recipe.time}
                            </Text>
                          </View>
                        </View>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
          <View className="absolute bottom-5 right-5 flex items-center justify-center">
            <TouchableOpacity
              onPress={() => router.push("/add-recipe")}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground p-2"
            >
              <Plus className="stroke-background" />
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </>
  );
}
