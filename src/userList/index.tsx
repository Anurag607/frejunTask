/// <reference path="../../global.d.ts" />

import React from "react";
import styles from "./styles.module.scss";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import UsersTable from "../components/table";
import SearchComponent from "react-material-ui-searchbar";
import bcrypt from "bcryptjs";

type template = { username: string; password: string };

const UserList = () => {
  const navigate = useNavigate();

  const [originalUserList, setOriginalUserList] = React.useState<any>(
    JSON.parse(localStorage.getItem("userList") || "[]")
  );
  const [userList, setUserList] = React.useState<any>([]);
  const tableRef = React.useRef(null);
  const loadingRef = React.useRef(null);

  const styling = {
    warning: React.useRef<HTMLSpanElement>(null),
  };

  React.useEffect(() => {
    document.querySelector("input")?.setAttribute("autocomplete", "off");
    let auth: template = JSON.parse(
      localStorage.getItem("auth") || '{ "username" : "", "password" : "" }'
    );
    bcrypt.compare(
      import.meta.env.VITE_PASSWORD,
      auth.password,
      function (err: any, isMatch: boolean) {
        if (err) throw err;
        else if (!isMatch && auth.username !== import.meta.env.VITE_USERNAME) {
          localStorage.removeItem("userList");
          localStorage.removeItem("auth");
          navigate("/", { replace: true });
          return;
        }
      }
    );
    if (originalUserList.length === 0) {
      fetch(import.meta.env.VITE_API, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": import.meta.env.VITE_API,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setUserList(data.users);
          setOriginalUserList(data.users);
          localStorage.setItem("userList", JSON.stringify(data.users));
          (loadingRef.current! as HTMLElement).style.transition = "all 0.3s";
          (loadingRef.current! as HTMLElement).style.opacity = "0";
          (tableRef.current! as HTMLElement).style.display = "block";
          setTimeout(() => {
            (loadingRef.current! as HTMLElement).style.display = "none";
            (tableRef.current! as HTMLElement).style.opacity = "1";
          }, 200);
        });
    } else {
      setUserList(originalUserList);
      (loadingRef.current! as HTMLElement).style.transition = "all 0.3s";
      (loadingRef.current! as HTMLElement).style.opacity = "0";
      (tableRef.current! as HTMLElement).style.display = "block";
      setTimeout(() => {
        (loadingRef.current! as HTMLElement).style.display = "none";
        (tableRef.current! as HTMLElement).style.opacity = "1";
      }, 200);
    }
  }, []);

  const requestSearch = (searchedVal: string) => {
    let tokens = searchedVal
      .toLowerCase()
      .split(" ")
      .filter(function (token) {
        return token.trim() !== "";
      });
    if (tokens.length === 0) {
      setUserList(originalUserList);
    } else {
      let filteredResults: any[] = [];
      let userString = "";
      let searchTermRegex = new RegExp(tokens.join("|"), "gim");
      originalUserList.forEach((row: any) => {
        userString +=
          row.firstName.toLowerCase() +
          row.lastName.toLowerCase() +
          row.email.toLowerCase();
        if (userString.match(searchTermRegex)) {
          filteredResults.push(row);
          userString = "";
        }
      });
      if (filteredResults.length === 0) {
        styling.warning.current!.style.display = "block";
      } else {
        styling.warning.current!.style.display = "none";
      }
      setUserList(filteredResults);
    }
  };

  return (
    <main className={styles.userListWrapper}>
      <nav className={styles.navbarWrapper}>
        <h2>FreJun Task</h2>
        <Button
          variant="outlined"
          onClick={() => {
            localStorage.removeItem("auth");
            localStorage.removeItem("userList");
            navigate(`/`, { replace: false });
          }}
        >
          Logout
        </Button>
      </nav>
      <div className={styles.subWrapper}>
        <span className={styles.warning} ref={styling.warning}>
          No User Matched!
        </span>
        <div className={styles.content}>
          <SearchComponent
            sx={{ width: "20rem" }}
            onChangeHandle={requestSearch}
          />
          <div ref={loadingRef}>Loading...</div>
          <div className={styles.userResCont} ref={tableRef}>
            <UsersTable data={userList} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserList;
