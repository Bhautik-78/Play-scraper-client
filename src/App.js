import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./Home";
import AppDetails from "./AppDetails";
import Category from "./Category";
import Daily from "./Daily";
import DailyAppDetails from "./DailyAppDetails";
import MenuBar from "./MenuBar";

const App = () => {
    return (
        <>
            <BrowserRouter>
                <MenuBar/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/appDetail" component={AppDetails}/>
                    <Route exact path="/category" component={Category}/>
                    <Route exact path="/daily" component={Daily}/>
                    <Route  path="/dailyAppDetail" component={DailyAppDetails}/>
                </Switch>
            </BrowserRouter>
        </>
    );
}
export default App;


