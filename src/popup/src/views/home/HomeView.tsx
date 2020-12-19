import React from "react";
import { AppBar, createStyles, Divider, fade, IconButton, InputBase, ListItem, ListSubheader, makeStyles, Paper, Theme, Toolbar, Typography } from "@material-ui/core";

import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import AccountBalanceOutlinedIcon from '@material-ui/icons/AccountBalanceOutlined';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { useHistory } from "react-router-dom";
import { ListItemLink } from "../../assets/components/ListItemLink";

import logo from './logo.svg';
import { SearchBar } from "../../assets/components/SearchBar";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        title: {
            flexGrow: 1,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            height: 28,
            margin: 4,
        },
    }),
);

export function HomeView() {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            {/* <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Personal Crypto
                    </Typography>
                    <IconButton color="inherit">
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar> */}
            <SearchBar />
            <Divider />
            <ListItemLink
                rightIcon={<AccountBalanceOutlinedIcon />}
                primary="Exchanges"
                leftIcon={<ArrowRightIcon />}
                to="/exchanges" />
            <ListItemLink
                rightIcon={<AccountBalanceWalletOutlinedIcon />}
                primary="Wallets"
                leftIcon={<ArrowRightIcon />}
                to="/wallets" />
            <Divider />
            <ListItemLink
                rightIcon={<AddIcon />}
                primary="Add Account"
                leftIcon={<ArrowRightIcon />}
                to="/add" />

        </div>
    );
}