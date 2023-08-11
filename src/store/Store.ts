import { createContext, useContext } from 'react';
import { Hook } from '../Services/HookService';
import { FoodListDto } from '../Models/FoodListDto';

export const StoreContext = createContext<{
    $foodList?: Hook<FoodListDto | null>,
    $foodNames?: Hook<string[]>,
}>({} as any);
export const useStoreContext = () => useContext(StoreContext);
