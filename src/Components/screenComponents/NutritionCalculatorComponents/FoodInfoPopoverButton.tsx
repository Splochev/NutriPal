import { Typography, IconButton, FormHelperText } from "@mui/material";
import {
  useNutritionCalculatorStyles,
  MACRO_NUTRIENTS,
} from "../../../Services/NutritionCalculatorService";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { NutritionPartitionBar } from "./NutritionPartitionBar";
import { FoodDto } from "../../../Models/FoodDto";
import Tooltip from "@mui/material/Tooltip";

interface FoodInfoPopoverButtonProps {
  foodDto: FoodDto;
}

export const FoodInfoPopoverButton: React.FC<FoodInfoPopoverButtonProps> = ({
  foodDto,
}) => {
  const { classes } = useNutritionCalculatorStyles();

  return (
    <Tooltip
      arrow
      placement="bottom"
      classes={{ tooltip: classes.tooltip }}
      title={
        <div className={classes.popover}>
          <div className={classes.label}>
            <div>🔥</div>
            <FormHelperText className={classes.popoverLabel}>
              &nbsp;{foodDto.calories} kcal &#x2022; {foodDto.quantity} G
            </FormHelperText>
          </div>
          <div className={classes.popoverNutritionContainer}>
            {MACRO_NUTRIENTS.map((nutrient) => (
              <div
                key={nutrient.name + nutrient.icon}
                className={classes.label}
              >
                <NutritionPartitionBar
                  // @ts-ignore
                  value={Number(foodDto[nutrient.name]) * nutrient.multiplier}
                  total={foodDto.calories}
                  color={nutrient.color}
                />
                <div>
                  <Typography
                    variant="subtitle2"
                    className={classes.nutritionValue}
                  >
                    {/* @ts-ignore */}
                    {foodDto[nutrient.name] || 0} g
                  </Typography>
                  <FormHelperText className={classes.popoverHelperText}>
                    {nutrient.name}
                  </FormHelperText>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <IconButton>
        <InfoOutlinedIcon />
      </IconButton>
    </Tooltip>
  );
};
