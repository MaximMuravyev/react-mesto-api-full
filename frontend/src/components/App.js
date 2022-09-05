import React, {useState, useEffect, useCallback} from "react";
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

function App() {
  const [cards, setCards] = useState([]);
  const [token, setToken] = useState('');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [userData, setUserData] = useState({
    userName: "",
    email: "",
  })

  const navigate = useNavigate();

  const handleTokenCheck = useCallback(() => {
    let jwt = localStorage.getItem("token");
    if (jwt){
      setToken(jwt);
      auth.checkToken(jwt).then((data) => { 
        if (data.data.email) {
          setUserData({
            userData: data.data._id,
            email: data.data.email,
          });
          setLoggedIn(true);
          setToken(data.token);
          navigate("/");
        }
      }).catch((error) => console.log(error));
    }
  }, [navigate]);

  useEffect(() => {
    handleTokenCheck();
  }, [handleTokenCheck]);

  useEffect(() => {
    if (loggedIn === true) {
      const token = localStorage.getItem("token");
      api.getDataUser(token)
        .then((profile) => {
          setCurrentUser(profile);
        })
        .catch((error) => console.log(error));
    }
  }, [loggedIn])


  useEffect(() => {
    if (loggedIn === true) {
      const token = localStorage.getItem("token");
      api.getDataInitialCards(token)
        .then((cards) => {
          setCards(cards);
        })
        .catch((error) => console.log(error));
    }
  }, [loggedIn])

  function handleCardLike(card) {
    let isLiked;
    if (typeof card.likes !== "undefined") {
      isLiked = card.likes.some((i) => i._id === currentUser.user._id);
    } else {
      isLiked = false;
    }
    const token = localStorage.getItem("token");
    api.toggleLike(card._id, isLiked, token)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c))
      })
      .catch(error => console.log(error))
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id, auth.checkToken)
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
    const token = localStorage.getItem("token");
    api.changeUser(data, token)
      .then(profile => {
        setCurrentUser(profile);
        closeAllPopups();
      })
      .catch(error => console.log(error))
  }

  function handleAddPlaceSubmit(data) {
    const token = localStorage.getItem("token");
    api
      .addCard(data, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => console.log(error))
  }

  function handleUpdateAvatar(data) {
    const token = localStorage.getItem("token");
    api.changeAvatar(data, token)
      .then(profile => {
        setCurrentUser(profile); 
        closeAllPopups()
      })
      .catch(error => console.log(error))
  }

  function handleInfoTool() {
    setInfoTooltipOpen(true);
  }

  function closeInfotoolTip() {
    closeAllPopups();
    navigate("/sign-up")
  }

  const handleRegister = (email, password) => {
    auth.register(email, password)
      .then((data) => {
        console.log("register", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data.user._id,
            email: data.user.email,
          });
        }
      })
      .then(() => {
        handleInfoTool()
      })
      .catch(() => setSuccess(true), handleInfoTool());
  }

  const handleLogin = (email, password) => {
    auth.login(email, password)
      .then((data) => {
        console.log("login", data);
        if (data.token) {
          setInfoTooltipOpen(false);
          localStorage.setItem("token", data.token);
          setUserData({
            userName: data.user._id,
            email: data.user.email,
          });
          setLoggedIn(true);
          navigate("/");
          handleTokenCheck();
        }
      })
      .catch(() => setSuccess(true), handleInfoTool()
      );
  }

  function handleSignOut(){
    localStorage.removeItem('token');
    setUserData({
      userName: "",
      email: "",
    });
    setLoggedIn(false);
    setToken('');
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
        image={infoTooltipOpen}/>
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
