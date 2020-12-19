import { AppBar, Toolbar, Typography } from "@material-ui/core";
import React from "react";
import {
    MemoryRouter,
    Switch,
    Route,
} from "react-router-dom";

import { ExchangeListView } from "../views/exchanges/ExchangeListView";
import { WalletListView } from "../views/wallets/WalletListView";
import { HomeView } from "../views/home/HomeView";
import { AddAssetView } from "../views/add/AddAssetView";

export function RootNavigator() {
    return (
        <MemoryRouter>
            <div>
                <Switch>
                    <Route path="/add">
                        <AddAssetView />
                    </Route>
                    <Route path="/wallets">
                        <WalletListView />
                    </Route>
                    <Route path="/exchanges">
                        <ExchangeListView />
                    </Route>
                    <Route path="/">
                        <HomeView />
                    </Route>
                </Switch>
            </div>
        </MemoryRouter>
    );
}