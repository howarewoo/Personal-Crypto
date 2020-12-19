import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { ListItemLink } from "../../assets/components/ListItemLink";
import { ExchangeListViewModel } from "./ExchangeListViewModel";

export function ExchangeListView() {
    const history = useHistory()
    const [behavior] = useState(new ExchangeListViewModel())

    return (
        <div>
            {behavior.store.exchanges.map((exchange) => (
                <ListItemLink primary={exchange.name} to="/"/>
            ))}
        </div>
    );
}