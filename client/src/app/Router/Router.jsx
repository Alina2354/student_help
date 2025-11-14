import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../Layout/Layout";
import HomePage from "../../pages/home/HomePage";
import AuthPage from "../../pages/auth/AuthPage";
import TeachersPage from "../../pages/teachers/TeachersPage";
import TeacherPage from "../../pages/teacher/TeacherPage";
import AdminPage from "../../pages/admin/AdminPage";
import SignUpForm from "../../features/SignUpForm/SignUpForm";
import SignInForm from "../../features/SignInForm/SignInForm";

export default function Router({ setUser, user }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout setUser={setUser} user={user} />}>
          <Route index element={<HomePage user={user} />} />
          <Route path="/auth" element={<AuthPage setUser={setUser} />} />
          <Route path="/signUp" element={<SignUpForm setUser={setUser} />} />
          <Route path="/signIn" element={<SignInForm setUser={setUser} />} />
          <Route path="/teachers" element={<TeachersPage />} />
          <Route path="/teacher/:id" element={<TeacherPage user={user} />} />
          <Route path="/admin" element={<AdminPage user={user} />} />
          <Route path="*" element={<h1>Нет контента</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
