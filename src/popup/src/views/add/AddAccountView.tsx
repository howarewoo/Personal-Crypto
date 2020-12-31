import React, { Fragment, useEffect, useState } from "react";

import { Button, Divider, ListItem, ListSubheader, makeStyles, TextField, Typography } from "@material-ui/core";
import { useAutocomplete } from "@material-ui/lab";

import { Header } from "../../assets/components/Header";

import { IExchangeInfo, SupportedExchangeInfo } from "../../../../models/SupportedExchanges";
import { IWalletInfo, SupportedWalletInfo } from "../../../../models/SupportedWallets";
import { SearchBar } from "../../assets/components/SearchBar";
import { AddAccountViewModel } from "./AddAccountViewModel";
import { useAccountActions, useAccounts } from "../../navigators/RootNavigatorContext";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

let supported: (IExchangeInfo | IWalletInfo)[] = [];
supported = supported.concat(SupportedExchangeInfo, SupportedWalletInfo);

export const AddAccountView = observer(() => {
    const accounts = useAccounts()
    const { addAccount } = useAccountActions()
    const history = useHistory()
    const [behavior] = useState(new AddAccountViewModel(accounts, addAccount, history))
    const {
        getInputProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
    } = useAutocomplete({
        options: supported.sort((a, b) => (a.type.localeCompare(b.type) || a.name.localeCompare(b.name))),
        getOptionLabel: (option) => option.name,
        groupBy: (option) => option.type,
        onChange: (event, value) => { behavior.setSelected(value) }
    });

    useEffect(() => {
        console.log(behavior.selected)
    }, [behavior.selected])

    const renderGroup = (group: any) => {
        return (
            <Fragment>
                <ListSubheader>{group.group}</ListSubheader>
                {group.options.map((option: any, optionIndex: number) => (
                    <ListItem button {...getOptionProps({ option, index: group.index + optionIndex })}>{option.name}</ListItem>
                ))}
            </Fragment>
        )
    }

    const renderAccountForm = () => {
        if (!behavior.selected || !behavior.selected.options) return null
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: "center",
                    padding: "10px"
                }}
            >
                {/* <Avatar alt={selected.name} src={selected.image} /> */}
                <TextField
                    style={{ width: "100%" }}
                    id="accountName"
                    label="Account Name"
                    autoComplete="off"
                    value={behavior.name.value}
                    onChange={(e) => behavior.setName(e.target.value)}
                    error={behavior.name.error}
                    helperText={behavior.name.message}
                />
                {behavior.selected.options.map((option: any) => (
                    <TextField
                        style={{ width: "100%" }}
                        id={option.id}
                        label={option.label}
                        autoComplete="off"
                        value={behavior.options[option.id].value}
                        onChange={(e) => behavior.setOption(option.id, e.target.value)}
                        error={behavior.options[option.id].error}
                        helperText={behavior.options[option.id].message}
                    />
                ))}
                <Button
                    style={{ margin: "10px" }}
                    variant="contained"
                    color="primary"
                    onClick={() => behavior.onFormSubmit()}>
                    Create
                </Button>
            </div >
        )
    }

    return (
        <div>
            <Header title="Add Account" />
            <Divider />
            <SearchBar placeholder="Search" inputProps={{ ...getInputProps() }} />
            <Divider />
            {groupedOptions.length > 0 ? (
                <div {...getListboxProps()}>
                    {groupedOptions.map(renderGroup)}
                </div>
            ) : !behavior.selected ? (
                <Typography style={{ textAlign: 'center', margin: "10px" }}>
                    Search for a supported account type
                </Typography>
            ) : renderAccountForm()}
        </div>
    );
})