import React, { useState, useContext, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const currentUser = useContext(CurrentUserContext);

  function handleChangeName(evt) {
    setName(evt.target.value)
  }

  function handleChangeDescription(evt) {
    setDescription(evt.target.value)
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about)
  }, [currentUser, props.isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateUser({ name, about: description })
  }

  return (
    <PopupWithForm
      name="popup_profile_edit"
      title="Редактировать профиль"
      form="form-name"
      btnText="Cохранить"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmitForm={handleSubmit}>
      <input
        className="popup__input popup__input_type_name"
        id="name"
        name="name"
        type="text"
        onChange={handleChangeName}
        value={name || ""}
        required
        minLength="2"
        maxLength="40"
        placeholder="Ваше имя" />
      <span
        className="popup__input-error name-input-error"
        id="name-errorr">
      </span>
      <input
        className="popup__input popup__input_type_job"
        id="job"
        name="about"
        type="text"
        onChange={handleChangeDescription}
        value={description || ""}
        required
        minLength="2"
        maxLength="200"
        placeholder="О себе" />
      <span
        className="popup__input-error info-input-error"
        id="job-error">
      </span>
    </PopupWithForm>
  );
}

export default EditProfilePopup