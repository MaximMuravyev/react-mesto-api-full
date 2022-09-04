import React from "react";
import vector from '../images/Vector.svg';

const Header = ({children}) => {
  return (
    <header className="header">
      <img className="header__logo" src={vector} alt="лого Место" />
      <div className="header__go">{children}</div>
    </header>
  );
}

export default Header