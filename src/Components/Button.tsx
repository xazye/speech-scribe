import React, { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    className?: string | undefined;
    onClick?: ()=>any
}

const Button: React.FC<ButtonProps> = ({children,className, onClick}) => {
    let default_classes = ["shadow-button border border-secondary rounded-full px-4 py-2 ext-xl font-semibold flex flex-row justify-between items-center  text-primary-300 hover:text-secondary hover:border-primary-400 duration-300 hover:shadow-primary-700 ", className].join(" ");
    
    return (
      <button onClick={onClick} className={default_classes}>{children}</button>
  );
};
export {Button};