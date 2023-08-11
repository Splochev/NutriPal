/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Typography, TextField, InputAdornment } from '@mui/material';
import { setChosenFoodsGrams, resetChosenFoodsGrams, calculateNutritionValue, deleteFood, useNutritionCalculatorStyles, MACRO_NUTRIENTS } from '../../../Services/NutritionCalculatorService'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Hook } from '../../../Services/HookService';
import { FoodDto } from '../../../Models/FoodDto';
import { CoreIconButton } from '../../common/CoreIconButton';
import { FoodInfoPopoverButton } from './FoodInfoPopoverButton';

interface ListItemContentProps {
    foodDto: FoodDto;
    $chosenFoodsGrams: Hook<{ [key: string]: number | string }>;
    $chosenFoods: Hook<FoodDto[]>;
    $foodList: Hook<string[]>;
}

export const ListItemContent: React.FC<ListItemContentProps> = ({ foodDto, $chosenFoodsGrams, $chosenFoods, $foodList }) => {
    const { classes } = useNutritionCalculatorStyles();

    return (
        <>
            <div className={classes.nutritionContainer}>
                <div className={classes.label}>
                    <Typography variant="subtitle1" className={classes.foodName}>{foodDto.name}</Typography>
                    <FoodInfoPopoverButton foodDto={foodDto} />
                    <CoreIconButton
                        icon={<RestartAltIcon />}
                        onClick={() => resetChosenFoodsGrams($chosenFoodsGrams, foodDto.name)}
                    />
                </div>
                <TextField
                    value={$chosenFoodsGrams.value[foodDto.name]}
                    onChange={e => setChosenFoodsGrams(e, foodDto.name, $chosenFoodsGrams)}
                    type="number"
                    variant="outlined"
                    InputProps={{ endAdornment: <InputAdornment position="end">G</InputAdornment> }}
                />
                <div className={classes.styledNutrition}>
                    <Typography variant="subtitle1">🔥</Typography>
                    <Typography variant="subtitle1" className={classes.nutritionValue}>
                        {calculateNutritionValue(foodDto.calories, foodDto.name, $chosenFoodsGrams)}
                    </Typography>
                    <Typography variant="subtitle1">kcal</Typography>
                </div>
                {MACRO_NUTRIENTS.map((nutrient) => (
                    <div className={classes.styledNutrition} key={nutrient.name}>
                        <Typography variant="subtitle1">{nutrient.icon}</Typography>
                        <Typography variant="subtitle1" className={classes.nutritionValue}>
                            {/* @ts-ignore */}
                            {calculateNutritionValue(foodDto[nutrient.name], foodDto.name, $chosenFoodsGrams)}
                        </Typography>
                        <Typography variant="subtitle1">
                            {nutrient.alias}
                        </Typography>
                    </div>
                ))}
                <CoreIconButton
                    className={classes.delete}
                    icon={<ClearOutlinedIcon />}
                    onClick={() => deleteFood(foodDto.name, $chosenFoodsGrams, $chosenFoods, $foodList)}
                />
            </div>
        </>
    );
};