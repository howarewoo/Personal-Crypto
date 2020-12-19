import React from "react";

import { useHistory } from "react-router-dom";

export function WalletListView() {
    const history = useHistory()

    return (
        <div>
            <div>
                <h2>Wallets</h2>
            </div>
            <button type="button" onClick={() => history.push("/")}>
                Home
            </button>

        </div>
    );
}