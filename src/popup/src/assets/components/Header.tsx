import React from "react"

import { useHistory } from "react-router-dom";

import { IconButton, Toolbar, Typography } from "@material-ui/core"
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

interface HeaderProps {
    title?: string;
    right?: React.ReactElement;
    rightOnClick?: () => void;
}

export const Header = (props: HeaderProps) => {
    const { title, right, rightOnClick } = props;
    const history = useHistory();
    return (
        <Toolbar variant="dense">
            <IconButton edge="start" onClick={() => history.goBack()} color="inherit" >
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
                {title}
            </Typography>
            {right && <IconButton edge="end" onClick={rightOnClick} color="inherit" >
                {right}
            </IconButton>}
        </Toolbar>
    )
}