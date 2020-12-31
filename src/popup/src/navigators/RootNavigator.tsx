import React from "react";
import {
    MemoryRouter,
    Switch,
    Route,
} from "react-router-dom";

import { ExchangeListView } from "../views/exchanges/ExchangeListView";
import { WalletListView } from "../views/wallets/WalletListView";
import { HomeView } from "../views/home/HomeView";
import { AddAccountView } from "../views/add/AddAccountView";
import { RootNavigatorProvider } from "./RootNavigatorContext";

export function RootNavigator() {
    return (
        <RootNavigatorProvider>
            <MemoryRouter>
                <div>
                    <Switch>
                        <Route path="/add">
                            <AddAccountView />
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
        </RootNavigatorProvider>
    );
}