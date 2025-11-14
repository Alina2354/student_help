import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../Layout/Layout";
import HomePage from "../../pages/home/HomePage";
import CookiesPage from "../../pages/cookies/CookiesPage";
import PersonalAccount from "../../pages/PersonalAccount/PersonalAccount";
import SignUpForm from "../../features/SignUpForm/SignUpForm";
import SignInForm from "../../features/SignInForm/SignInForm";
import TasksPage from "../../pages/tasks/TaskPage";
import AiPage from "../../pages/ai/AiPage";

export default function Router({ setUser, user }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout setUser={setUser} user={user} />}>
          <Route index element={<HomePage user={user} />} />
          <Route path="/signUp" element={<SignUpForm setUser={setUser} />} />
          <Route path="/signIn" element={<SignInForm setUser={setUser} />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/tasks" element={<TasksPage setUser={setUser} user={user} />} />
          <Route path="/personalAccount" element={<PersonalAccount />} />
          <Route path="/ai" element={<AiPage />} />
          <Route path="*" element={<h1>Нет контента</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
