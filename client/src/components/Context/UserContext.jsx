import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = React.createContext();
export default function UserContextProvider({ children }) {
  const [userIDSession, setUserIDSession] = useState(null);
  const [userNameSession, setUserNameSession] = useState(null);

  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const signupInputsHandler = (e) => {
    setInputs((prevEvents) => ({
      ...prevEvents,
      [e.target.name]: e.target.value,
    }));
  };

  const signupSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/users/signup`, {
        login: inputs.login,
        password: inputs.password,
        name: inputs.name,
      });
      if (response.status === 200) {
        const data = response;
        setUserIDSession(data.userID);
        setUserNameSession(data.userName);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signinSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/users/signin`, {
        login: inputs.login,
        password: inputs.password,
      });
      if (response.status === 200) {
        const data = response;
        setUserIDSession(data.userID);
        setUserNameSession(data.userName);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ useMemo для контекста
  const contextValue = useMemo(
    () => ({
      inputs,
      userIDSession,
      userNameSession,
      signupInputsHandler,
      signupSubmitHandler,
      signinSubmitHandler,
    }),
    [inputs, userIDSession, userNameSession] // 📌 В useMemo, массив зависимостей [inputs, userIDSession, userNameSession] означает:
    // «Пересоздавай contextValue только тогда, когда inputs, userIDSession или userNameSession изменятся.»
    // inputs, userIDSession, userNameSession — это состояния, которые могут меняться.
    // signupInputsHandler и signupSubmitHandler — это функции, которые не пересоздаются каждый рендер.
    // [inputs, userIDSession, userNameSession]
    // Если одно из этих состояний изменится, useMemo пересоздаст contextValue.
  );
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export { UserContext };
