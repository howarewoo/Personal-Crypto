import { ListItem, ListSubheader, TextField } from "@material-ui/core";
import { Autocomplete, AutocompleteProps, useAutocomplete, UseAutocompleteProps } from "@material-ui/lab";
import React, { useEffect } from "react";


import { useHistory } from "react-router-dom";
import { SearchBar } from "../../assets/components/SearchBar";

export function AddAssetView() {
    const history = useHistory()
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
    } = useAutocomplete({
        options: supported,
        getOptionLabel: (option) => option.name,
        groupBy: (option) => option.type,
    });

    useEffect(() => {
        console.log(groupedOptions)
    }, [groupedOptions])

    const renderGroup = (group: string, options: { name: string, type: SupportedTypes }[]) => {
        return (
            <div>
                <ListSubheader>{group}</ListSubheader>

                {options.map((option, index) => (
                    <ListItem>{option.name}</ListItem>
                ))}
            </div>
        )
    }

    return (
        <div style={{ height: "400px" }}>
            <div>
                <h2>Add Asset</h2>
            </div>
            <SearchBar inputProps={{ ...getInputProps() }} />
            {
                groupedOptions.length > 0 ? (
                    groupedOptions.map((group: any, index) => (
                        renderGroup(group.group, group.options)
                    ))
                ) : null
            }
        </div>
    );
}


enum SupportedTypes {
    EXCHANGE = "exchange",
    WALLET = "wallet"
}

const supported = [
    {
        name: "Binance US",
        type: SupportedTypes.EXCHANGE,
    },
    {
        name: "Bitcoin",
        type: SupportedTypes.WALLET
    },
    {
        name: "Litecoin",
        type: SupportedTypes.WALLET
    }
]
