/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { FoodDto } from "../Models/FoodDto";
import { FoodListDto } from "../Models/FoodListDto";
import { useHook } from "./HookService";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function useFoodFirestore() {
  const $foodNames = useHook<string[]>([]);
  const $foodList = useHook<FoodListDto | null>(null);
  const $loading = useHook<boolean>(false);

  const getAllFoods = async () => {
    if ($foodList.value) return;
    try {
      $loading.set(true);
      const foodListData: FoodListDto = {};
      (await getDocs(collection(db, "nutripal"))).forEach((doc) => {
        const data = JSON.parse(doc.data().data);
        foodListData[data.name] = data as FoodDto;
      });
      $foodList.set(foodListData);
    } catch (error) {
      console.error("Error getting documents:", error);
    } finally {
      $loading.set(false);
    }
  };

  const getFood = async (foodName: string) => {
    try {
      const docRef = doc(db, "nutripal", encodeURIComponent(foodName));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return JSON.parse(docSnap.data().data) as FoodDto;
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const searchFoodNames = (keyword: string) => {
    if ($foodNames.value.length) {
      const foodNames = $foodNames.value;
      const filteredFoodNames = foodNames.filter((foodName) =>
        foodName.includes(keyword)
      );
      return filteredFoodNames;
    }
    return [];
  };

  const addFood = async (food: FoodDto) => {
    try {
      if ($foodNames.value.includes(food.name)) return;
      const collectionRef = collection(db, "nutripal");
      const documentRef = doc(collectionRef, encodeURIComponent(food.name));
      await setDoc(documentRef, {
        data: JSON.stringify(food),
      });

      await resetFoodNames([...$foodNames.value, food.name]);
    } catch (error) {
      $foodNames.set([
        ...$foodNames.value.filter((name) => name !== food.name),
      ]);
      console.error("Error adding document:", error);
    }
  };

  const deleteFood = async (foodName: string) => {
    try {
      const collectionRef = collection(db, "nutripal");
      const documentRef = doc(collectionRef, encodeURIComponent(foodName));
      await deleteDoc(documentRef);
      await resetFoodNames(
        $foodNames.value.filter((name) => name !== foodName)
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const arePropertiesChanged = (oldFood: FoodDto, newFood: FoodDto) => {
    return (
      oldFood.calories !== newFood.calories ||
      oldFood.carbs !== newFood.carbs ||
      oldFood.fat !== newFood.fat ||
      oldFood.fiber !== newFood.fiber ||
      oldFood.protein !== newFood.protein ||
      oldFood.quantity !== newFood.quantity
    );
  };

  const editFood = async (foodName: string, updatedFood: FoodDto) => {
    try {
      const collectionRef = collection(db, "nutripal");
      const oldDocumentRef = doc(collectionRef, encodeURIComponent(foodName));
      const oldDocumentSnapshot = await getDoc(oldDocumentRef);
      const oldDocumentData = oldDocumentSnapshot.data();
      const isFoodNameChanged = foodName !== updatedFood.name;
      const arePropsChanged = arePropertiesChanged(
        //@ts-ignore
        JSON.parse(oldDocumentData.data) as FoodDto,
        updatedFood
      );

      if (isFoodNameChanged) {
        const newDocumentRef = doc(
          collectionRef,
          encodeURIComponent(updatedFood.name)
        );
        await setDoc(newDocumentRef, {
          data: JSON.stringify(updatedFood),
        });
        await deleteDoc(oldDocumentRef);
      } else if (arePropsChanged) {
        await updateDoc(oldDocumentRef, {
          data: JSON.stringify(updatedFood),
        });
      }

      if (isFoodNameChanged) {
        await resetFoodNames(
          $foodNames.value.map((name) =>
            name === foodName ? updatedFood.name : name
          )
        );
      }
    } catch (error) {
      console.error("Error editing document:", error);
    }
  };

  const getAllFoodNames = async () => {
    try {
      $loading.set(true);
      const docRef = doc(db, "nutripal", "food_names");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const names = docSnap.data()["food_names"] as string[];
        $foodNames.set(names);
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    } finally {
      $loading.set(false);
    }
  };

  const resetFoodNames = async (newFoodNames?: string[]) => {
    try {
      const collectionRef = collection(db, "nutripal");
      const documentRef = doc(collectionRef, "food_names");
      await updateDoc(documentRef, {
        food_names: newFoodNames ? newFoodNames : $foodNames.value,
      });
      if (newFoodNames) {
        $foodNames.set(newFoodNames);
      }
    } catch (error) {
      console.error("Error resetting food_names:", error);
    }
  };

  useEffect(() => {
    getAllFoodNames();
  }, []);

  return {
    $foodList,
    $loading,
    $foodNames,
    deleteFood,
    addFood,
    editFood,
    searchFoodNames,
    getFood,
    getAllFoods,
  };
}

export default useFoodFirestore;
