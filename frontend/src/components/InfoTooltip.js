const InfoTooltip = (props) => {
  return(
    <div className={`popup ${props.name} ${props.isOpen && "popup_is-open"}`}>
      <div className="popup__container">
        <button className="popup__close" onClick={props.onClose}></button>
          <img className="message__image" alt={props.message} src={props.image}/>
          <h2 className="message__text">{props.message}</h2>
      </div>
    </div>
  );
};

export default InfoTooltip;
