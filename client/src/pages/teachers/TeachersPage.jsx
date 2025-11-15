import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import axiosInstance from "../../shared/lib/axiosInstace";
import styles from "./TeachersPage.module.css";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await TeacherApi.getAllTeachers();
      if (response.statusCode === 200) {
        setTeachers(response.data || []);
      }
    } catch (err) {
      setError("Ошибка загрузки преподавателей");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    // Если путь начинается с /files, используем полный URL без /api
    if (avatarPath.startsWith("/files")) {
      const baseUrl = axiosInstance.defaults.baseURL.replace("/api", "");
      return `${baseUrl}${avatarPath}`;
    }
    return `${axiosInstance.defaults.baseURL}${avatarPath}`;
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Преподаватели</h1>
      <div className={styles.teachersGrid}>
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className={styles.teacherCard}
            onClick={() => navigate(`/teacher/${teacher.id}`)}
          >
            {teacher.avatar && (
              <img
                src={getAvatarUrl(teacher.avatar)}
                alt="Аватар"
                className={styles.teacherAvatar}
              />
            )}
            <h3 className={styles.teacherName}>
              {teacher.last_name} {teacher.first_name}{" "}
              {teacher.middle_name || ""}
            </h3>
            {teacher.faculty && (
              <p className={styles.teacherInfo}>Факультет: {teacher.faculty}</p>
            )}
            {teacher.department && (
              <p className={styles.teacherInfo}>
                Кафедра: {teacher.department}
              </p>
            )}
            {teacher.disciplines && teacher.disciplines.length > 0 && (
              <p className={styles.teacherInfo}>
                Дисциплин: {teacher.disciplines.length}
              </p>
            )}
          </div>
        ))}
      </div>
      {teachers.length === 0 && (
        <p className={styles.empty}>Преподаватели не найдены</p>
      )}
    </div>
  );
}
