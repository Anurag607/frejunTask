/// <reference path="../../global.d.ts" />

import React from "react";
import styles from "./style.module.scss";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

interface LoginForm extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}

interface LoginFormEl extends HTMLFormElement {
  readonly elements: LoginForm;
}

type template = { username: string; password: string };

const Login = () => {
  const [logindet, Setlogindet] = React.useState<template>({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    let auth: template = JSON.parse(
      localStorage.getItem("auth") || '{ "username" : "", "password" : "" }'
    );
    bcrypt.compare(
      import.meta.env.VITE_PASSWORD,
      auth.password,
      function (err: any, isMatch: boolean) {
        if (err) throw err;
        else if (isMatch && auth.username === import.meta.env.VITE_USERNAME) {
          navigate(`/userList`, { replace: false });
        }
      }
    );
  }, []);

  const styling = {
    username: React.useRef<HTMLInputElement>(null),
    pass: React.useRef<HTMLInputElement>(null),
    warning: React.useRef<HTMLSpanElement>(null),
  };

  const HandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.currentTarget;
    switch (target.name) {
      case "username": {
        Setlogindet({
          ...logindet,
          username: target.value,
        });
        break;
      }
      case "password": {
        Setlogindet({
          ...logindet,
          password: target.value,
        });
        break;
      }
      default: {
        Setlogindet({
          ...logindet,
        });
        break;
      }
    }
  };

  const HandleSubmit = (e: React.FormEvent<LoginFormEl>) => {
    e.preventDefault();
    if (
      logindet.username !== import.meta.env.VITE_USERNAME ||
      logindet.password !== import.meta.env.VITE_PASSWORD
    ) {
      styling.warning.current!.style.display = "block";
      styling.username.current!.style.borderColor = "red";
      styling.pass.current!.style.borderColor = "red";
    } else {
      const hashedPass = bcrypt.hashSync(logindet.password, 10);
      let data = {
        username: logindet.username,
        password: hashedPass,
      };
      localStorage.setItem("auth", JSON.stringify(data));
      navigate(`/userList`, { replace: false });
    }
  };

  return (
    <main className={styles.loginWrapper}>
      <form onSubmit={HandleSubmit}>
        <h2>Log in</h2>
        <span className={styles.warning} ref={styling.warning}>
          Invalid Username or Password
        </span>
        <span className={styles.inputField}>
          <label htmlFor="username"> Username </label>
          <input
            className={styles.loginUsername}
            value={logindet.username}
            onChange={HandleChange}
            name="username"
            ref={styling.username}
            id="username"
            type="username"
            placeholder="Enter your username"
            autoComplete="false"
          />
        </span>
        <span className={styles.inputField}>
          <label htmlFor="password"> Password </label>
          <input
            className={styles.loginPass}
            name="password"
            ref={styling.pass}
            id="password"
            value={logindet.password}
            onChange={HandleChange}
            type="password"
            placeholder="Enter your Password"
            autoComplete="false"
          />
        </span>
        <input
          type="submit"
          placeholder="Login"
          value="Login"
          name="submit"
          className={styles.loginSubmit}
          disabled={
            logindet.username.length === 0 || logindet.password.length === 0
              ? true
              : false
          }
          style={{
            opacity: `${
              logindet.username.length === 0 || logindet.password.length === 0
                ? 0.5
                : 1
            }`,
            cursor: `${
              logindet.username.length === 0 || logindet.password.length === 0
                ? "default"
                : "pointer"
            }`,
          }}
        />
      </form>
    </main>
  );
};

export default Login;
