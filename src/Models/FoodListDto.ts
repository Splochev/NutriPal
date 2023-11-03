import { FoodDto } from "./FoodDto";

export interface FoodListDto {
  [key: string | number]: FoodDto;
}
