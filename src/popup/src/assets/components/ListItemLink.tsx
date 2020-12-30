import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Link as RouterLink, LinkProps as RouterLinkProps, useLocation } from 'react-router-dom';
import { Omit } from '@material-ui/types';
import { Avatar, ListItemAvatar, ListItemSecondaryAction } from '@material-ui/core';

export interface ListItemLinkProps {
    avatar?: React.ReactElement;
    rightIcon?: React.ReactElement;
    primary?: string;
    secondary?: string;
    leftIcon?: React.ReactElement;
    onClick?: () => void;
    to?: string;
}

export function ListItemLink(props: ListItemLinkProps) {
    const { avatar, rightIcon, primary, secondary, leftIcon, onClick, to } = props;
    let location = useLocation();

    const renderLink = React.useMemo(
        () =>
            React.forwardRef<any, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
                <RouterLink to={to || location.pathname} ref={ref} {...itemProps} />
            )),
        [to],
    );

    return (
        <ListItem button component={renderLink} onClick={onClick}>
            {avatar ? <ListItemAvatar>{avatar}</ListItemAvatar> :
                rightIcon ? <ListItemIcon>{rightIcon}</ListItemIcon> : null}
            <ListItemText primary={primary} secondary={secondary} />
            {leftIcon ? leftIcon : null}
        </ListItem>
    );
}