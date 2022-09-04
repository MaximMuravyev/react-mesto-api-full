import React, {useState} from "react";

const Login = ({ handleLogin, title, buttonName}) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    handleLogin(userEmail, userPassword);
  }
  const handleLoginUserPassword = (evt) => {
    setUserPassword(evt.target.value);
  }
  const handleLoginUserEmail = (evt) => {
    setUserEmail(evt.target.value);
  }

  return (
    <section className='popup__sign'>
      <form className='popup__form_register' name='form-sign' onSubmit={handleSubmit}>
        <div className="popup__main-container">
          <h2 className="popup__heading popup__heading_sign">{title}</h2>
          <div className={"popup__input-container_sign"}>
            <input
              className="popup__input popup__input_sign"
              name="email"
              id="email"
              type="email"
              placeholder="email"
              minLength="3"
              value={userEmail}
              onChange={handleLoginUserEmail}
              required/>
            <input
              className="popup__input popup__input_sign"
              name="password"
              id="password"
              type="password"
              placeholder="пароль"
              minLength="3"
              value={userPassword}
              onChange={handleLoginUserPassword}
              required/>
          </div>
          <button className="popup__button popup__button_sign" type="submit">
            {buttonName || 'Сохранить'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default Login;