import React from "react";

import { createStyles, Divider, makeStyles, Theme } from "@material-ui/core";

import { ListItemLink } from "../../assets/components/ListItemLink";

import { SearchBar } from "../../assets/components/SearchBar";
import { AccountBalanceOutlined, AccountBalanceWalletOutlined, Add, GitHub, ArrowRight } from "@material-ui/icons";

export function HomeView() {
    return (
        <div style={{ width: '100%' }}>
            <SearchBar placeholder="Search Accounts" />
            <Divider />
            <ListItemLink
                rightIcon={<AccountBalanceOutlined />}
                primary="Exchanges"
                leftIcon={<ArrowRight />}
                to="/exchanges" />
            <ListItemLink
                rightIcon={<AccountBalanceWalletOutlined />}
                primary="Wallets"
                leftIcon={<ArrowRight />}
                to="/wallets" />
            <Divider />
            <ListItemLink
                rightIcon={<Add />}
                primary="Add Account"
                leftIcon={<ArrowRight />}
                to="/add" />
            <Divider />
            <ListItemLink
                rightIcon={<GitHub />}
                primary="Github"
                leftIcon={<ArrowRight />}
                onClick={() => window.open("https://github.com/awoox2/personal-crypto", "_blank")} />
        </div>
    );
}