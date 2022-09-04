function ImagePopup(props) {
  return (
    <div className={`popup popup_card-open ${props.isOpen && "popup_is-open"}`} id="popupImage">
      <div className="popup__card-container">
        <img
          className="popup__open-img"
          src={props.card.link}
          alt={props.card.name} />
        <h2 className="popup__open-title">{props.card.name}</h2>
        <button
          className="popup__close popup__close_open_card"
          type="button"
          onClick={props.onClose}
          aria-label="Закрыть">
        </button>
      </div>
    </div>
  );
};

export default ImagePopup