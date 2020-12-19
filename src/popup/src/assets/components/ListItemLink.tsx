import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { Omit } from '@material-ui/types';
import { ListItemSecondaryAction } from '@material-ui/core';

export interface ListItemLinkProps {
    rightIcon?: React.ReactElement;
    primary: string;
    leftIcon?: React.ReactElement;
    to: string;
}

export function ListItemLink(props: ListItemLinkProps) {
    const { rightIcon, primary, leftIcon, to } = props;

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
                <RouterLink to={to} ref={ref} {...itemProps} />
            )),
        [to],
    );

    return (
        <ListItem button component={renderLink}>
            {rightIcon ? <ListItemIcon>{rightIcon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
            {leftIcon ? leftIcon : null}
        </ListItem>
    );
}