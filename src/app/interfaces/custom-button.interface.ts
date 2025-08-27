export interface ICustomButton {
    color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
    text?: string;
    fill?: 'solid' | 'clear' | 'outline' | 'opacity';
    icon?: string;
    iconPosition?: 'left' | 'right';
}

export interface ICustomButtonModal extends ICustomButton {
    role?: 'cancel' | 'confirm';
    action?: () => void;
} 

export interface ICustomButtonSidemenu extends ICustomButton {
    position: 'left' | 'right';
    action?: () => void;
} 