import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./login";
import UserList from "./userList";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Login />} />
          <Route path={"/userList"} element={<UserList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
