import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import ProfileEditor from "./components/ProfileEditor";
import ChatRooms from "./components/ChatRooms";

import {
  checkUserSession,
  registersUser,
  loginUser,
} from "./redux/actions/userActions";
function App() {
  // --------------------------------------------------------------------------------------
  // Состояние формы и загрузки
  const [inputs, setInputs] = useState({}); // Данные формы ввода (логин/регистрация)
  const [loading, setLoadings] = useState(true); // Флаг загрузки,  для отображения спиннера

  // --------------------------------------------------------------------------------------
  // Redux: получение и установка состояния пользователя
  const { userID, userName, userAvatar } = useSelector((store) => store.user); // Достаём пользователя из стора
  const dispatch = useDispatch(); // Хук для вызова экшенов
  const navigate = useNavigate(); // Навигация между страницамиы

  // --------------------------------------------------------------------------------------
  // Обработчик изменения инпутов
  // Обернут в useCallback — создаётся один раз, не зависит от внешних переменных
  const inputsUsersHandler = useCallback((e) => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      [e.target.name]: e.target.value,
    }));
    // setInputs не нужно указывать в зависимостях: React гарантирует её стабильность
  }, []);

  // --------------------------------------------------------------------------------------
  // Проверка сессии пользователя при монтировании
  useEffect(() => {
    const verifySession = async () => {
      await dispatch(checkUserSession());
      setLoadings(false); // завершили проверку, отключаем спиннер
    };
    verifySession();
  }, [userID, userName]); // будет повторно вызываться, если данные пользователя изменятся

  // --------------------------------------------------------------------------------------
  // Обработчик отправки формы регистрации
  // Оборачиваем в useCallback для стабильной ссылки и предотвращения лишних перерендеров
  const signupSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      await dispatch(registersUser(inputs, navigate)); // передаём данные и функцию перехода
    },
    // useCallback(fn, [a, b, c])
    // Создай и сохрани версию функции fn, которая будет пересоздана только если a, b или c изменятся.
    [inputs, dispatch, navigate] // зависим от inputs, навигации и dispatch
  );

  // --------------------------------------------------------------------------------------
  // Обработчик отправки формы входа
  // Оборачиваем в useCallback для стабильной ссылки и предотвращения лишних перерендеров
  const signinSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();
      await dispatch(loginUser(inputs, navigate)); // аналогично регистрации
    },
    // useCallback(fn, [a, b, c])
    // Создай и сохрани версию функции fn, которая будет пересоздана только если a, b или c изменятся.
    [inputs, dispatch, navigate] // зависим от inputs, навигации и dispatch
  );

  // --------------------------------------------------------------------------------------
  // Пропсы, передаваемые в дочерние компоненты (Signup, Signin, Navbar)
  // Обёрнуты в useMemo, чтобы избежать лишнего рендера, если зависимости не изменились
  const userPropsData = useMemo(
    () => ({
      inputs,
      userID,
      userName,
      userAvatar,
      inputsUsersHandler,
      signupSubmitHandler,
      signinSubmitHandler,
    }),
    [
      inputs, // если данные формы изменились
      userID, // если меняется пользователь (логин/логаут)
      userName,
      userAvatar,
      inputsUsersHandler, // функция стабилизирована useCallback
      signupSubmitHandler,
      signinSubmitHandler,
    ]
  );

  // Логика для регистрации и логирования пользователя
  // --------------------------------------------------------------------------------------

  return (
    <>
      <Navbar userPropsData={userPropsData} />
      {/* Роуты регистрации и входа */}
      <Routes>
        <Route path="/" element={<ChatRooms />} />
        <Route
          path="/signup"
          element={<Signup userPropsData={userPropsData} />}
        />
        <Route
          path="/signin"
          element={<Signin userPropsData={userPropsData} />}
        />
        <Route path="/profileeditor" element={<ProfileEditor />} />
      </Routes>
    </>
  );
}

export default App;
