import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import SignInForm from "../../features/SignInForm/SignInForm";
import SignUpForm from "../../features/SignUpForm/SignUpForm";

export default function AuthPage({setUser}) {

  const [isLogin, setLogin] = useState(true);
  return (
    <>
      <div><h1>AuthPage</h1></div>
      <Button onClick={() => setLogin((prev) => !prev)}>
        {isLogin ? "Регистрация" : "Вход"}
      </Button>
      <div>{isLogin ? <SignInForm setUser={setUser}/> : <SignUpForm setUser={setUser}/>}</div>
    </>
  );
}