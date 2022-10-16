import React, {useState, useEffect} from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import {api} from '../utils/Api.js';
import {Routes, Route, useNavigate, Navigate} from "react-router-dom";
import {Link} from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import imageError from "../images/reject.png";
import imageSuccess from "../images/success.png";

function App() {
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [infoTooltipImage, setInfoTooltipImage] = useState(imageSuccess);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
  })

  const navigate = useNavigate();

  const handleTokenCheck = () => {
    const jwt = localStorage.getItem("token");
    if (jwt){
      auth.checkToken(jwt).then((data) => { 
        if (data.email) {
          setUserData({
            userData: data._id,
            email: data.email,
          });
          setLoggedIn(true);
          navigate("/");
        }
      }).catch((error) => console.log(error));
    }
  }

  useEffect(() => {
    handleTokenCheck();
  }, []);

  useEffect(() => {
    if (loggedIn === true) {
      api.getDataUser()
        .then((profile) => {
          setCurrentUser(profile);
        })
        .catch((error) => console.log(error));
    }
  }, [loggedIn])


  useEffect(() => {
    if (loggedIn === true) {
      api.getDataInitialCards()
        .then((cards) => {
          setCards(cards);
        })
        .catch((error) => console.log(error));
    }
  }, [loggedIn])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch(error => console.log(error))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id === card._id ? '' : c));
      })
      .catch(error => console.log(error))
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true)
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true)
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true)
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsCardOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltipOpen(false);
    setIsCardOpen(false);
  }

  function updateUser(data) {
    api.changeUser(data)
      .then(data => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  function handleAddPlaceSubmit(data) {
    api
      .addCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(error))
  }

  function handleUpdateAvatar(data) {
    api.changeAvatar(data)
      .then(profile => {
        setCurrentUser(profile); 
        closeAllPopups()
      })
      .catch(error => console.log(error))
  }

  function closeInfotoolTip() {
    closeAllPopups();
    navigate("/sign-up")
  }

  const handleRegister = (email, password) => {
    auth.register(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data._id,
            email: data.email,
          });
        }
      })
      .then(() => {
        setSuccess(true)
        setInfoTooltipImage(imageSuccess);
        setMessage("Вы успешно зарегистрировались!");
        setInfoTooltipOpen(true);
        navigate("/sign-in");
      })
      .catch((error) => {
        setInfoTooltipImage(imageError);
        setMessage("Что-то пошло не так! Попробуйте ещё раз.");
        setInfoTooltipOpen(true);
        console.log(`Ошибка ${error}`);
      })
  }

  const handleLogin = (email, password) => {
    auth.login(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data._id,
            email: data.email,
          });
          setLoggedIn(true);
          navigate("/");
          handleTokenCheck();
        }
      })
      .catch((error) => {
        setSuccess(true)
        setInfoTooltipOpen(true);
        setInfoTooltipImage(imageError);
        setMessage("Что-то пошло не так! Попробуйте ещё раз.");
        console.log(`Ошибка ${error}`);
      });
  }

  function handleSignOut(){
    localStorage.removeItem("token");
    setUserData({
      userName: "",
      email: "",
    });
    setLoggedIn(false);
    navigate("/sign-in");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
      <div className="page__content">
      <Routes>
        <Route
          path="/"
          element={
          <>
          <Header>
          <div>
            <span className="header__email">{userData.email}</span>
            <button className="header__exit" onClick={handleSignOut}>Выйти</button>
          </div>
          </Header>
          <ProtectedRoute
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={loggedIn}>
          </ProtectedRoute>
          <Footer/>
          </>
          }
        />

        <Route
          path="/sign-in"
          element={
          <div className="page">
            <Header>
              <Link to={"/sign-up"} className="header__go-to">Регистрация</Link>
            </Header>
            <Login
              title="Вход"
              buttonName="Войти"
              handleLogin={handleLogin}/>
          </div>
          }
        />

        <Route
          path="/sign-up"
          element={
          <div className="page">
          <div className="page__content">
            <Header>
              <Link to={"/sign-in"} className="header__go-to">Войти</Link>
            </Header>
            <Register
              title="Регистрация"
              buttonName="Зарегистрироваться"
              handleRegister={handleRegister}>
            <Link to={"/sign-in"} style={{ textDecoration: 'none', color: 'white' }} className="popup__button_go-to">Уже зарегистрированы? Войти</Link>
            </Register>
          </div>
          </div>
          }
        />

        <Route 
          path="*" 
          element={
          <Navigate to="/sign-in"/>}
        />

        <Route
          path="/"
          element={
          loggedIn ? (<Navigate to="/" replace />) : (<Navigate to="/sign-in" replace />)
          }
        />

      </Routes>

      <InfoTooltip
        isOpen={infoTooltipOpen}
        onClose={isSuccess ? closeAllPopups : closeInfotoolTip}
        isSuccess={isSuccess}
        image={infoTooltipImage}
        message={message}/>
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddCard={handleAddPlaceSubmit}/>
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}/>
      <EditProfilePopup
        onUpdateUser={updateUser}
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}/>
      <ImagePopup
        card={selectedCard}
        isOpen={isCardOpen}
        onClose={closeAllPopups}/>
      </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App