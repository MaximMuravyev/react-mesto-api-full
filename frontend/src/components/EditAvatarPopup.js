import React, { useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const avatarInput = useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarInput.current.value
    });
  }

  useEffect(() => {
    if (props.isOpen) {
      avatarInput.current.value = '';
    }
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="popup_pic_edit"
      title="Обновить аватар"
      form="form-new-avatar"
      btnText="Сохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmitForm={handleSubmit}>
      <input
        className="popup__input popup__input_type_link"
        id="avatar"
        name="avatar"
        type="url"
        ref={avatarInput}
        autoComplete="off"
        placeholder="Ссылка на картинку" />
      <span
        className="popup__input-error url-input-error pic-input-error"
        id="avatar-error">
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup
