import React, { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAccounts } from "../../navigators/RootNavigatorContext";

import { Avatar, Divider, Typography } from "@material-ui/core";
import { Header } from "../../assets/components/Header";
import { ListItemLink } from "../../assets/components/ListItemLink";

import { PersonalCryptoAccount } from "../../../../models/PersonalCryptoAccount";

import { AccountView } from "../account/AccountView";

export const ExchangeListView = observer(() => {
    const accounts = useAccounts().filter((a) => !!a.exchange);
    const [selected, setSelected] = useState<PersonalCryptoAccount>()
    let { path, url } = useRouteMatch();

    return (
        <Switch>
            <Route exact path={path}>
                <div style={{ height: "400px" }}>
                    <Header title="Exchanges" />
                    <Divider />
                    {accounts.length ?
                        accounts.map((account) => {
                            return (
                                <ListItemLink
                                    avatar={<Avatar alt={account.exchange} src="/static/images/avatar/1.jpg" />}
                                    primary={account.exchange}
                                    secondary={account.name}
                                    onClick={() => setSelected(account)}
                                    to={`${url}/account`}
                                />
                            )
                        }) :
                        <Typography>
                            No saved exchanges
                        </Typography>}
                </div>
            </Route>
            <Route path={`${path}/account`}>
                <AccountView account={selected} />
            </Route>
        </Switch>
    );
})