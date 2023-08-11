import { FoodDto } from "../Models/FoodDto";
import { Hook } from "./HookService";
import { makeStyles } from 'tss-react/mui';

export const MACRO_NUTRIENTS = [
    { name: 'protein', icon: '🍖', alias: 'P', multiplier: 4, color: '#0074D9' },
    { name: 'carbs', icon: '🍩', alias: 'C', multiplier: 4, color: '#FF851B' },
    { name: 'fat', icon: '🥑', alias: 'F', multiplier: 9, color: '#2ECC40' },
    { name: 'fiber', icon: '🌾', alias: 'FB', multiplier: 2, color: '#8B4513' }
];

export const useNutritionCalculatorStyles = makeStyles()((theme) => {
    return {
        listItem: {
            padding: theme.spacing(1),
            border: '1px solid #e0e0e0',
            borderRadius: theme.spacing(2),
            marginBottom: theme.spacing(1.5),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            width: theme.spacing(131.375),
        },
        foodName: {
            textTransform: 'capitalize',
            fontWeight: 'bold',
            marginRight: theme.spacing(1),
            marginLeft: theme.spacing(1),
            width: theme.spacing(16)
        },
        nutritionContainer: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            '& .MuiOutlinedInput-root': {
                height: theme.spacing(3.5),
                width: theme.spacing(14.5),
            },
            '& .MuiInputLabel-outlined:not(.Mui-focused)': {
                transform: 'translate(14px, 7px) scale(1)'
            }
        },
        styledNutrition: {
            display: 'flex',
            gap: theme.spacing(0.5),
            borderBottom: '2px solid #e0e0e0',
            width: theme.spacing(14.375),
            marginLeft: theme.spacing(3),
        },
        nutritionValue: {
            minWidth: theme.spacing(7.5),
            color: 'black',
        },
        label: {
            display: 'flex',
            alignItems: 'center',
        },
        delete: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        popover: {
            padding: theme.spacing(2),
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(3),
        },
        popoverNutritionContainer: {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        popoverHelperText: {
            textTransform: 'capitalize',
            fontSize: theme.spacing(1.75),
        },
        popoverLabel: {
            fontSize: theme.spacing(2),
        },
        tooltip: {
            backgroundColor: 'white',
            boxShadow: theme.shadows[1],
            height: 'auto',
        }
    };
});

export const chooseFood = async (
    $chosenFoods: Hook<FoodDto[]>,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $foodChoice: Hook<string>,
    $foodList: Hook<string[]>,
    getFood: (foodName: string) => Promise<FoodDto | undefined>
) => {
    if ($foodChoice.value === '') return;
    const foodChoice = $foodChoice.value;
    $foodChoice.set('');
    const food = await getFood(foodChoice);
    if (food === undefined) return;
    $chosenFoodsGrams.set({ ...$chosenFoodsGrams.value, [foodChoice]: 100 });
    $chosenFoods.set([...$chosenFoods.value, food]);
    $foodList.set($foodList.value.filter((food) => food !== foodChoice));
};

export const calculateNutrients = (
    $chosenFoods: Hook<FoodDto[]>,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $nutrients: Hook<{ [key: string]: number }>
) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    $chosenFoods.value.forEach((food) => {
        if ($chosenFoodsGrams.value[food.name]) {
            const grams = Number($chosenFoodsGrams.value[food.name]);
            totalCalories += ((food.calories || 0) / food.quantity) * grams;
            totalProtein += ((food.protein || 0) / food.quantity) * grams;
            totalCarbs += ((food.carbs || 0) / food.quantity) * grams;
            totalFat += ((food.fat || 0) / food.quantity) * grams;
            totalFiber += ((food.fiber || 0) / food.quantity) * grams;
        }
    });

    $nutrients.set({
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        fiber: totalFiber
    });
};

export const setChosenFoodsGrams = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    foodName: string,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>
) => {
    $chosenFoodsGrams.set({
        ...$chosenFoodsGrams.value,
        [foodName]: e.target.value
    })
};

export const resetChosenFoodsGrams = (
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    foodName: string
) => {
    $chosenFoodsGrams.set({
        ...$chosenFoodsGrams.value,
        [foodName]: '100'
    })
};

export const calculateNutritionValue = (
    value: number,
    foodName: string,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>
) => {
    const grams = $chosenFoodsGrams?.value[foodName];
    if (grams) {
        return Math.round((((value || 0) * Number(grams) / 100) + Number.EPSILON) * 100) / 100;
    }
    return '';
};

export const deleteFood = (
    foodName: string,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $chosenFoods: Hook<FoodDto[]>,
    $foodList: Hook<string[]>
) => {
    const newChosenFoodsGrams = { ...$chosenFoodsGrams.value };
    delete newChosenFoodsGrams[foodName];
    $chosenFoodsGrams.set(newChosenFoodsGrams);
    $chosenFoods.set($chosenFoods.value.filter((food) => food.name !== foodName));
    $foodList.set([...$foodList.value, foodName]);
};