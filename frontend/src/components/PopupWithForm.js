function PopupWithForm(props) {
  return (
    <div className={`popup ${props.name} ${props.isOpen && "popup_is-open"}`}>
      <div className="popup__container">
        <button className="popup__close" onClick={props.onClose}></button>
        <h3 className="popup__title">{props.title}</h3>
        <form name={props.form} className="popup__form" onSubmit={props.onSubmitForm}>
          {props.children}
          <button className="popup__button" type="submit">{props.btnText}</button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm