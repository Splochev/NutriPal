import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Hook } from "../../../Services/HookService";

interface FoodListAutoCompleteProps {
  $foodList: Hook<string[]>;
  $foodChoice: Hook<string>;
}

export const FoodListAutoComplete: React.FC<FoodListAutoCompleteProps> = ({
  $foodList,
  $foodChoice,
}) => {
  return (
    <Autocomplete
      disablePortal
      options={$foodList.value}
      value={$foodChoice.value ? $foodChoice.value : null}
      onChange={(event, value) => $foodChoice.set(value ?? "")}
      renderInput={(params) => <TextField {...params} label="Search food..." />}
    />
  );
};
