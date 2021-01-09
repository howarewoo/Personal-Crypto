import React, { useMemo } from 'react';
import { Link, LinkProps, useLocation } from 'react-router-dom';

import { ListItemAvatar } from '@material-ui/core';
import { Omit } from '@material-ui/types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

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
    const { avatar, rightIcon, primary, secondary, leftIcon, onClick} = props;
    const location = useLocation();
    const to = props.to || location.pathname;

    const renderLink = useMemo(
        () =>
            React.forwardRef<any, Omit<LinkProps, 'to'>>((itemProps, ref) => (
                <Link to={to} ref={ref} {...itemProps} />
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