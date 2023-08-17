import React, { forwardRef } from 'react';
import { IconButton } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

interface CoreIconButtonProps {
    onClick?: () => void;
    icon: React.ReactNode;
    className?: string;
    title?: string;
    id?: string;
    disabled?: boolean;
}

export const CoreIconButton = forwardRef<HTMLButtonElement, CoreIconButtonProps>(
    ({ onClick, title, icon, id, disabled, ...rest }, ref) => {
        const IconButtonComponent = (
            <IconButton
                id={id}
                disabled={disabled}
                onClick={onClick}
                ref={ref}
                {...rest}
            >
                {icon}
            </IconButton>
        );

        return title ? <Tooltip title={title}>{IconButtonComponent}</Tooltip> : IconButtonComponent;
    }
);