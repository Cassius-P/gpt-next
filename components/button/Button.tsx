import React, { ReactNode } from 'react';
import styles from './Button.module.css'

type ButtonProps = {
  text?: string;
  color: 'blue' | 'green' | 'red' | 'yellow' | 'orange' | 'gray' | 'white' ;
  type?: 'button' | 'submit' | 'reset';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  customClass?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  type = 'button',
  icon,
  iconPosition = (text == null || text == "") ? 'center' :"left",
  customClass,
  onClick,
}) => {
  const getButtonStyle = () => {
    return styles["btn-" + color]
  };

  let classes = `flex items-center w-full justify-center py-2 text-md font-semibold rounded-md leading-none ${getButtonStyle()}`;
  if(customClass) {
    classes += ` ${customClass}`
  }
  return (
    <button
      type={type}
      className={`${classes}`}
      onClick={onClick}
    >
      {icon && iconPosition === 'center' && (
        <span>{icon}</span>
      )}
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