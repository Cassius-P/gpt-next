import React from 'react';
import styles from './Button.module.css'

type ButtonProps = {
  text: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'orange';
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  type = 'button',
  icon,
  iconPosition = 'left',
  onClick,
}) => {
  const getButtonStyle = () => {
    return styles["btn-" + color]
  };

  return (
    <button
      type={type}
      className={`flex items-center w-full justify-center py-4 text-md font-semibold rounded-md leading-none ${getButtonStyle()}`}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {text}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;