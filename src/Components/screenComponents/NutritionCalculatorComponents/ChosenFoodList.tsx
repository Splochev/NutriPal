/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { List, ListItem } from "@mui/material";
import { List as ReactMovableList, arrayMove } from "react-movable";
import { Hook, useHook } from "../../../Services/HookService";
import { FoodDto } from "../../../Models/FoodDto";
import {
  useNutritionCalculatorStyles,
  deleteFood,
  startDraggingListItem,
  showButtonInInterval,
  checkIfCursorIsOnDeleteButton,
  deleteFoodIfDroppedOnDeleteButton,
} from "../../../Services/NutritionCalculatorService";
import { ListItemContent } from "./ListItemContent";
import Divider from "@mui/material/Divider";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { CoreIconButton } from "../../common/CoreIconButton";
import clsx from "clsx";

interface ChosenFoodListProps {
  $chosenFoods: Hook<Array<FoodDto | string>>;
  $chosenFoodsGrams: Hook<{ [key: string]: number | string }>;
  $foodList: Hook<string[]>;
}

export const ChosenFoodList: React.FC<ChosenFoodListProps> = ({
  $chosenFoods,
  $chosenFoodsGrams,
  $foodList,
}) => {
  const { classes } = useNutritionCalculatorStyles();
  const $draggedListItem = useHook<FoodDto | string>("");
  const $cursorIsOnDeleteItem = useHook<boolean>(false);
  const $draggedStartTime = useHook<number | null>(null);
  const $showButton = useHook<boolean>(false);
  const $itemForDeletion = useHook<FoodDto | string>("");

  const onMouseUpDeleteListItem = (event: any) => {
    deleteFoodIfDroppedOnDeleteButton(
      event,
      $draggedListItem,
      $showButton,
      $draggedStartTime,
      $itemForDeletion,
      onMouseUpDeleteListItem
    );
  };

  const onMouseMoveOverDeleteButton = (event: any) => {
    checkIfCursorIsOnDeleteButton(event, $cursorIsOnDeleteItem);
  };

  useEffect(() => {
    deleteFood($itemForDeletion, $chosenFoods, $chosenFoodsGrams, $foodList);
  }, [$itemForDeletion.value]);

  useEffect(() => {
    showButtonInInterval($showButton, $draggedStartTime, $draggedListItem);
  }, [$draggedListItem.value, $draggedStartTime.value]);

  useEffect(() => {
    const deleteButtonElement = document.getElementById("deleteListItemBtn");
    if (deleteButtonElement)
      document.addEventListener("mousemove", onMouseMoveOverDeleteButton);
    return () =>
      document.removeEventListener("mousemove", onMouseMoveOverDeleteButton);
  }, []);

  useEffect(() => {
    if ($draggedListItem.value)
      document.addEventListener("mouseup", onMouseUpDeleteListItem);
    else document.removeEventListener("mouseup", onMouseUpDeleteListItem);
    return () =>
      document.removeEventListener("mouseup", onMouseUpDeleteListItem);
  }, [$draggedListItem.value]);

  return (
    <div>
      <ReactMovableList
        values={$chosenFoods.value}
        onChange={({ oldIndex, newIndex }) =>
          $chosenFoods.set(arrayMove($chosenFoods.value, oldIndex, newIndex))
        }
        renderList={({ children, props }) => <List {...props}>{children}</List>}
        renderItem={({ value, props, isDragged }) => {
          startDraggingListItem(
            isDragged,
            value,
            $showButton,
            $draggedStartTime,
            $draggedListItem
          );
          return typeof value === "object" ? (
            <ListItem
              {...props}
              key={value.name}
              className={clsx(
                classes.listItem,
                $showButton.value && $draggedListItem.value === value
                  ? classes.draggedListItem
                  : null
              )}
            >
              <ListItemContent
                foodDto={value}
                $chosenFoodsGrams={$chosenFoodsGrams}
                $chosenFoods={$chosenFoods}
                $foodList={$foodList}
              />
            </ListItem>
          ) : (
            <ListItem
              {...props}
              key={value}
              className={clsx(
                classes.listItemDivider,
                $showButton.value && $draggedListItem.value === value
                  ? classes.draggedListItem
                  : null
              )}
            >
              <Divider />
            </ListItem>
          );
        }}
      />
      <div
        className={clsx(
          classes.deleteListItemBtn,
          $cursorIsOnDeleteItem.value ? classes.hoveredDeleteListItemBtn : null,
          $showButton.value
            ? classes.showDeleteListItemBtn
            : classes.hideDeleteListItemBtn
        )}
      >
        <CoreIconButton
          id="deleteListItemBtn"
          title="Delete item"
          icon={<ClearOutlinedIcon />}
        />
      </div>
    </div>
  );
};
