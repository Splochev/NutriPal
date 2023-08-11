import { IconButton } from '@mui/material';

interface CoreIconButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export const CoreIconButton: React.FC<CoreIconButtonProps> = ({ icon, onClick, ...rest }) => {
    return (
        <IconButton onClick={onClick} {...rest}>
            {icon}
        </IconButton>
    );
};
