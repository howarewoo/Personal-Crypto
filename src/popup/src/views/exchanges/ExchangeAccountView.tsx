import { TextField } from "@material-ui/core";
import React from "react";

import { useHistory } from "react-router-dom";

export function ExchangeAccountView() {
    const history = useHistory()

    return (
        <div>
            <div>
                <h2>Account</h2>
            </div>
            <TextField id="standard-basic" label="Standard" />

            <button type="button" onClick={() => history.goBack()}>
                back
            </button>

        </div>
    );
}