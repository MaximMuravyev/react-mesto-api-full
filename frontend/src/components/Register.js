import React, {useState} from "react";
const Register = ({title, handleRegister, buttonName, children}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleRegister(userEmail, userPassword);
  };
  const handleRegisterUserPassword = (evt) => {
    setUserPassword(evt.target.value);
  };
  const handleRegisterUserEmail = (evt) => {
    setUserEmail(evt.target.value);
  };

  return (
    <section className="popup__sign">
      <form className="popup__form popup__form_register" onSubmit={handleSubmit} name="form-sign">
        <div className="popup__main-container">
          <h2 className="popup__heading popup__heading_sign">{title}</h2>
          <div className={"popup__input-container_sign"}>
            <input
              className="popup__input popup__input_sign"
              name="email"
              id="email"
              placeholder="email"
              type="email"
              minLength="3"
              onChange={handleRegisterUserEmail}
              value={userEmail}
              required/>
            <input
              className="popup__input popup__input_sign"
              name="password"
              id="password"
              type="password"
              placeholder="пароль"
              minLength="3"
              onChange={handleRegisterUserPassword}
              value={userPassword}
              required/>
          </div>
          <button type="submit" className="popup__button popup__button_sign">{buttonName || "Сохранить"}</button>
          <p className="popup__button_go">{children}</p>
        </div>
      </form>
    </section>
  );
}

export default Register;