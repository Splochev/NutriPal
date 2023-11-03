/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useFoodFirestore from "../Services/FoodFirestoreServices";
import { useHook } from "../Services/HookService";
import { FoodListAutoComplete } from "../Components/screenComponents/NutritionCalculatorComponents/FoodListAutoComplete";
import {
  calculateNutrients,
  chooseFood,
  useNutritionCalculatorStyles,
} from "../Services/NutritionCalculatorService";
import { FoodDto } from "../Models/FoodDto";
import { ChosenFoodList } from "../Components/screenComponents/NutritionCalculatorComponents/ChosenFoodList";
import { CoreIconButton } from "../Components/common/CoreIconButton";
import BorderHorizontalIcon from "@mui/icons-material/BorderHorizontal";
import { v4 as uuidv4 } from "uuid";

const NutritionCalculator = () => {
  const { classes } = useNutritionCalculatorStyles();
  const { $foodNames, getFood } = useFoodFirestore();
  const $foodList = useHook<string[]>([]);
  const $foodChoice = useHook<string>("");
  const $chosenFoods = useHook<Array<FoodDto | string>>([]);
  const $chosenFoodsGrams = useHook<{ [key: string]: number | string }>({});
  const $nutrients = useHook<{ [key: string]: number }>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
  });

  useEffect(() => $foodList.set([...$foodNames.value]), [$foodNames.value]);

  useEffect(() => {
    chooseFood(
      $chosenFoods,
      $chosenFoodsGrams,
      $foodChoice,
      $foodList,
      getFood
    );
  }, [$foodChoice.value]);

  useEffect(() => {
    calculateNutrients($chosenFoods, $chosenFoodsGrams, $nutrients);
  }, [$chosenFoods.value, $chosenFoodsGrams.value]);

  return (
    <div>
      <div className={classes.toolbar}>
        <FoodListAutoComplete $foodList={$foodList} $foodChoice={$foodChoice} />
        <CoreIconButton
          className={classes.addDividerButton}
          title="Add Divider"
          icon={<BorderHorizontalIcon />}
          disabled={
            !$chosenFoods.value.some((item) => typeof item === "object")
          }
          onClick={() =>
            $chosenFoods.set([`divider-${uuidv4()}`, ...$chosenFoods.value])
          }
        />
      </div>
      {$chosenFoods.value.length > 0 ? (
        <ChosenFoodList
          $chosenFoods={$chosenFoods}
          $chosenFoodsGrams={$chosenFoodsGrams}
          $foodList={$foodList}
        />
      ) : null}
    </div>
  );
};

export default NutritionCalculator;
