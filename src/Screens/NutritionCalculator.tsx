/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import useFoodFirestore from '../Services/FoodFirestoreServices';
import { useHook } from '../Services/HookService';
import { FoodListAutoComplete } from '../Components/screenComponents/NutritionCalculatorComponents/FoodListAutoComplete';
import { calculateNutrients, chooseFood } from '../Services/NutritionCalculatorService';
import { FoodDto } from '../Models/FoodDto';
import { ChosenFoodList } from '../Components/screenComponents/NutritionCalculatorComponents/ChosenFoodList';

const NutritionCalculator = () => {
    const { $foodNames, getFood } = useFoodFirestore();
    const $foodList = useHook<string[]>([]);
    const $foodChoice = useHook<string>('');
    const $chosenFoods = useHook<FoodDto[]>([]);
    const $chosenFoodsGrams = useHook<{ [key: string]: number | string }>({});
    const $nutrients = useHook<{ [key: string]: number }>({ calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });

    useEffect(() => {
        $foodList.set([...$foodNames.value]);
    }, [$foodNames.value]);

    useEffect(() => {
        chooseFood($chosenFoods, $chosenFoodsGrams, $foodChoice, $foodList, getFood);
    }, [$foodChoice.value]);

    useEffect(() => {
        calculateNutrients($chosenFoods, $chosenFoodsGrams, $nutrients);
    }, [$chosenFoods.value, $chosenFoodsGrams.value]);

    return (
        <div>
            <FoodListAutoComplete
                $foodList={$foodList}
                $foodChoice={$foodChoice}
            />
            <ChosenFoodList
                $chosenFoods={$chosenFoods}
                $chosenFoodsGrams={$chosenFoodsGrams}
                $foodList={$foodList}
            />
        </div>
    );
};




export default NutritionCalculator;