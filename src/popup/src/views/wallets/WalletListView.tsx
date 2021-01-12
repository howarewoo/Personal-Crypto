import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { useAccounts } from "../../navigators/RootNavigatorContext";

import { Avatar, Divider, Typography } from "@material-ui/core";
import { Header } from "../../assets/components/Header";
import { ListItemLink } from "../../assets/components/ListItemLink";

import { PersonalCryptoAccount } from "../../../../models/PersonalCryptoAccount";

import { AccountView } from "../account/AccountView";

export function WalletListView() {
    const accounts = useAccounts().filter((a) => !!a.wallet);
    const [selected, setSelected] = useState<PersonalCryptoAccount>()
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <div style={{ height: "400px" }}>
                    <Header title="Wallets" />
                    <Divider />
                    {accounts.length ?
                        accounts.map((account) => {
                            return (
                                <ListItemLink
                                    avatar={<Avatar 
                                        alt={account.wallet} 
                                        src="/static/images/avatar/1.jpg" />}
                                    primary={account.wallet}
                                    secondary={account.name}
                                    onClick={() => setSelected(account)}
                                    to={`${url}/account`}
                                />
                            )
                        }) :
                        <div style={{}}>
                            <Typography>
                                No saved wallets
                            </Typography>
                        </div>}
                </div>
            </Route>
            <Route path={`${path}/account`}>
                <AccountView account={selected} />
            </Route>
        </Switch>
    );
}