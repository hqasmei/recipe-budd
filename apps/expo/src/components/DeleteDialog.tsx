import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Text } from "@/components/ui/text";
import { Trash2 } from "@/components/Icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Recipe } from "@/lib/types";
import { Pressable, View } from "react-native";
import { router } from "expo-router";

export default function DeleteDialog({ recipeId }: { recipeId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const storedRecipesJSON = await AsyncStorage.getItem("recipes");
      const storedRecipes = storedRecipesJSON
        ? JSON.parse(storedRecipesJSON)
        : [];
      const filteredRecipes = storedRecipes.filter(
        (recipe: Recipe) => recipe.slug !== recipeId
      );

      await AsyncStorage.setItem("recipes", JSON.stringify(filteredRecipes));
      setIsOpen(false);  
      router.back();  
    } catch (error) {
      console.error("Failed to delete the recipe:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        <Trash2 size={20} className="stroke-red-500" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className="">
          <AlertDialogTitle className="text-center">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            This action cannot be undone. This will permanently delete your
            recipe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <View className="flex flex-row items-center justify-evenly gap-2">
            <AlertDialogCancel className="w-1/2">
              <Pressable onPress={() => setIsOpen(false)}>
                <Text>Cancel</Text>
              </Pressable>
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 w-1/2">
              <Pressable onPress={handleDelete}>
                <Text>Continue</Text>
              </Pressable>
            </AlertDialogAction>
          </View>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
