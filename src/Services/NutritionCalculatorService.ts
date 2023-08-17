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
            width: theme.spacing(125),
        },
        draggedListItem: {
            border: '1px solid #0074D9'
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
        },
        listItemDivider: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: theme.spacing(1.5),
            paddingBottom: theme.spacing(3),
            paddingLeft: theme.spacing(0),
            paddingRight: theme.spacing(0),
            width: theme.spacing(125),
            borderRadius: theme.spacing(2),
            '& .MuiDivider-root': {
                width: '100%',
            }
        },
        toolbar: {
            display: 'flex',
            maxWidth: theme.spacing(125),
            gap: theme.spacing(2),
            '& .MuiAutocomplete-root': {
                width: '100%',
                '& .MuiInputBase-root': {
                    borderRadius: theme.spacing(2)
                }
            }
        },
        addDividerButton: {
            padding: theme.spacing(2),
        },
        deleteListItemBtn: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: theme.spacing(125),
            '& .MuiIconButton-root': {
                color: '#ff1744'
            }
        },
        hoveredDeleteListItemBtn: {
            '& .MuiIconButton-root': {
                backgroundColor: '#FFD1DA',
            }
        },
        showDeleteListItemBtn: {
            '& .MuiIconButton-root': {
                display: 'unset'
            }
        },
        hideDeleteListItemBtn: {
            '& .MuiIconButton-root': {
                display: 'none',
            }
        }
    };
});

export const chooseFood = async (
    $chosenFoods: Hook<Array<FoodDto | string>>,
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
    $chosenFoods: Hook<Array<FoodDto | string>>,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $nutrients: Hook<{ [key: string]: number }>
) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalFiber = 0;

    $chosenFoods.value.forEach((food) => {
        if (typeof food === 'object' && $chosenFoodsGrams.value[food.name]) {
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

export const deleteFoodFromChosenFoods = (
    foodName: string,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $chosenFoods: Hook<Array<FoodDto | string>>,
    $foodList: Hook<string[]>
) => {
    const newChosenFoodsGrams = { ...$chosenFoodsGrams.value };
    delete newChosenFoodsGrams[foodName];
    $chosenFoodsGrams.set(newChosenFoodsGrams);
    const filteredValues = $chosenFoods.value.filter((food) => (typeof food === 'object' && food.name !== foodName) || (typeof food === 'string' && food !== foodName));
    $chosenFoods.set(filteredValues);
    $foodList.set([...$foodList.value, foodName]);
    return filteredValues;
};

export const startDraggingListItem = (
    isDragged: boolean,
    value: FoodDto | string,
    $showButton: Hook<boolean>,
    $draggedStartTime: Hook<number | null>,
    $draggedListItem: Hook<FoodDto | string>
) => {
    if (isDragged) {
        if ($draggedStartTime.value === null && $showButton.value === false) {
            $draggedStartTime.set(0);
        }
        $draggedListItem.set(value);
    } else {
        $draggedListItem.set('');
    }
}

export const showButtonInInterval = (
    $showButton: Hook<boolean>,
    $draggedStartTime: Hook<number | null>,
    $draggedListItem: Hook<FoodDto | string>
) => {
    if ($draggedListItem.value && ($draggedStartTime.value || $draggedStartTime.value === 0)) {
        if ($draggedStartTime.value >= 0 && $draggedStartTime.value < 30) {
            $draggedStartTime.set($draggedStartTime.value + 1);
        }
        if ($draggedStartTime.value === 30) {
            $draggedStartTime.set(null);
            $showButton.set(true);
        }
    }
}

export const deleteFood = (
    $itemForDeletion: Hook<FoodDto | string>,
    $chosenFoods: Hook<Array<FoodDto | string>>,
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>,
    $foodList: Hook<string[]>
) => {
    if ($itemForDeletion.value) {
        setTimeout(() => {
            if (typeof $itemForDeletion.value === 'object') {
                const leftChosenFoods = deleteFoodFromChosenFoods($itemForDeletion.value.name, $chosenFoodsGrams, $chosenFoods, $foodList);
                const hasFoodDto = leftChosenFoods.find((item) => typeof item === 'object');
                if (!hasFoodDto) {
                    $chosenFoods.set([]);
                }
            } else {
                $chosenFoods.set($chosenFoods.value.filter((item) => item !== $itemForDeletion.value));
            }
            $itemForDeletion.set('');
        }, 500);
    }
};

export const checkIfCursorIsOnDeleteButton = (
    event: any,
    $cursorIsOnDeleteItem: Hook<boolean>,
) => {
    const deleteButtonElement = document.getElementById('deleteListItemBtn');
    if (deleteButtonElement) {
        const deleteButtonRect = deleteButtonElement.getBoundingClientRect();

        const isMouseOverDeleteButton =
            event.clientX >= deleteButtonRect.left &&
            event.clientX <= deleteButtonRect.right &&
            event.clientY >= deleteButtonRect.top &&
            event.clientY <= deleteButtonRect.bottom;

        $cursorIsOnDeleteItem.set(isMouseOverDeleteButton);
    }
};

export const deleteFoodIfDroppedOnDeleteButton = (
    event: any,
    $draggedListItem: Hook<FoodDto | string>,
    $showButton: Hook<boolean>,
    $draggedStartTime: Hook<number | null>,
    $itemForDeletion: Hook<FoodDto | string>,
    onMouseUpDeleteListItem: (event: any) => void
) => {
    const deleteButtonElement = document.getElementById('deleteListItemBtn');
    let itemForDeletion = '';
    if ($draggedListItem.value && deleteButtonElement) {
        const deleteButtonRect = deleteButtonElement.getBoundingClientRect();

        const isMouseOverDeleteButton =
            event.clientX >= deleteButtonRect.left &&
            event.clientX <= deleteButtonRect.right &&
            event.clientY >= deleteButtonRect.top &&
            event.clientY <= deleteButtonRect.bottom;

        if (isMouseOverDeleteButton) {
            itemForDeletion = JSON.parse(JSON.stringify($draggedListItem.value));
        }
    }
    $showButton.set(false);
    $draggedListItem.set('');
    setTimeout(() => $draggedStartTime.set(null), 250);
    $itemForDeletion.set(itemForDeletion);
    document.removeEventListener('mouseup', onMouseUpDeleteListItem);
}