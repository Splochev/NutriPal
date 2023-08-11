
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { List, ListItem } from '@mui/material';
import { List as ReactMovableList, arrayMove } from 'react-movable';
import { Hook } from '../../../Services/HookService';
import { FoodDto } from '../../../Models/FoodDto';
import { useNutritionCalculatorStyles } from '../../../Services/NutritionCalculatorService';
import { ListItemContent } from './ListItemContent';

interface ChosenFoodListProps {
    $chosenFoods: Hook<FoodDto[]>;
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>;
    $foodList: Hook<string[]>;
}

export const ChosenFoodList: React.FC<ChosenFoodListProps> = ({ $chosenFoods, $chosenFoodsGrams, $foodList }) => {
    const { classes } = useNutritionCalculatorStyles();

    return (
        <ReactMovableList
            values={$chosenFoods.value}
            onChange={({ oldIndex, newIndex }) =>
                $chosenFoods.set(arrayMove($chosenFoods.value, oldIndex, newIndex))
            }
            renderList={({ children, props }) => <List {...props}>{children}</List>}
            renderItem={({ value, props }) => (
                <ListItem {...props} className={classes.listItem} key={value.name}>
                    <ListItemContent
                        foodDto={value}
                        $chosenFoodsGrams={$chosenFoodsGrams}
                        $chosenFoods={$chosenFoods}
                        $foodList={$foodList}
                    />
                </ListItem>
            )}
        />
    );
};
