import React from "react";

import { Divider } from "@material-ui/core";
import { 
    AccountBalanceOutlined, 
    AccountBalanceWalletOutlined, 
    Add, 
    GitHub, 
    ArrowRight,
    Launch } from "@material-ui/icons";
import { ListItemLink } from "../../assets/components/ListItemLink";


export function HomeView() {
    return (
        <div style={{ width: '100%' }}>
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
                leftIcon={<Launch />}
                onClick={() => window.open("https://github.com/awoox2/personal-crypto", "_blank")} />
        </div>
    );
}