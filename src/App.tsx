import { StoreContext } from "./store/Store";
import FoodList from "./Screens/FoodList";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NutritionCalculator from "./Screens/NutritionCalculator";

function App() {
  return (
    <div className="App">
      <StoreContext.Provider value={{}}>
        <Router>
          <Switch>
            <Route exact path="/">
              <NutritionCalculator />
            </Route>
            <Route path="/food-list">
              <FoodList />
            </Route>
          </Switch>
        </Router>
      </StoreContext.Provider>
    </div>
  );
}

export default App;
