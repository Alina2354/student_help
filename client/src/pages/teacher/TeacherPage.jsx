import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import DisciplineApi from "../../entites/discipline/api/DisciplineApi";
import TeacherRatingApi from "../../entites/teacherRating/api/TeacherRatingApi";
import FaqApi from "../../entites/faq/api/FaqApi";
import styles from "./TeacherPage.module.css";

export default function TeacherPage({ user }) {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [rating, setRating] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [faqText, setFaqText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTeacherData();
  }, [id]);

  useEffect(() => {
    if (teacher) {
      loadDisciplines();
    }
  }, [teacher, selectedSemester]);

  const loadTeacherData = async () => {
    try {
      setIsLoading(true);
      const [teacherRes, ratingRes, faqsRes] = await Promise.all([
        TeacherApi.getTeacherById(id),
        TeacherRatingApi.getRatingByTeacherId(id),
        FaqApi.getFaqsByTeacherId(id)
      ]);

      if (teacherRes.statusCode === 200) {
        setTeacher(teacherRes.data);
      }
      if (ratingRes.statusCode === 200) {
        setRating(ratingRes.data);
      }
      if (faqsRes.statusCode === 200) {
        setFaqs(faqsRes.data || []);
      }
    } catch (err) {
      setError("Ошибка загрузки данных");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDisciplines = async () => {
    try {
      let response;
      if (selectedSemester === "all") {
        response = await DisciplineApi.getDisciplinesByTeacherId(id);
      } else {
        response = await DisciplineApi.getDisciplinesByTeacherAndSemester(
          id,
          parseInt(selectedSemester)
        );
      }
      if (response.statusCode === 200) {
        setDisciplines(response.data || []);
      }
    } catch (err) {
      console.error("Ошибка загрузки дисциплин:", err);
    }
  };

  const handleIncrementRating = async (ratingType) => {
    try {
      const response = await TeacherRatingApi.incrementRating(id, ratingType);
      if (response.statusCode === 200) {
        setRating(response.data);
      }
    } catch (err) {
      alert("Ошибка при оценке");
      console.error(err);
    }
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    if (!faqText.trim()) return;

    try {
      const response = await FaqApi.createFaq({
        teacher_id: parseInt(id),
        text: faqText.trim()
      });
      if (response.statusCode === 201) {
        setFaqText("");
        loadTeacherData();
      }
    } catch (err) {
      alert("Ошибка при создании FAQ");
      console.error(err);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm("Удалить этот FAQ?")) return;

    try {
      const response = await FaqApi.deleteFaq(faqId);
      if (response.statusCode === 200) {
        loadTeacherData();
      }
    } catch (err) {
      alert("Ошибка при удалении FAQ");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !teacher) {
    return <div className={styles.error}>{error || "Преподаватель не найден"}</div>;
  }

  const semesters = teacher.disciplines
    ? [...new Set(teacher.disciplines.map((d) => d.semester))].sort()
    : [];

  return (
    <div className={styles.container}>
      {/* Информация о преподавателе */}
      <div className={styles.teacherInfo}>
        <h1 className={styles.teacherName}>
          {teacher.last_name} {teacher.first_name} {teacher.middle_name || ""}
        </h1>
        {teacher.faculty && (
          <p className={styles.infoItem}>Факультет: {teacher.faculty}</p>
        )}
        {teacher.department && (
          <p className={styles.infoItem}>Кафедра: {teacher.department}</p>
        )}
      </div>

      {/* Дисциплины */}
      <div className={styles.section}>
        <h2>Дисциплины</h2>
        <div className={styles.filter}>
          <label>
            Семестр:
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className={styles.select}
            >
              <option value="all">Все</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className={styles.disciplinesList}>
          {disciplines.map((discipline) => (
            <div key={discipline.id} className={styles.disciplineItem}>
              <h4>{discipline.title}</h4>
              <p>Семестр: {discipline.semester}</p>
            </div>
          ))}
          {disciplines.length === 0 && (
            <p className={styles.empty}>Дисциплины не найдены</p>
          )}
        </div>
      </div>

      {/* Рейтинги */}
      <div className={styles.section}>
        <h2>Рейтинги</h2>
        {rating && (
          <div className={styles.ratings}>
            <div className={styles.ratingItem}>
              <span>Оценка 5:</span>
              <span className={styles.ratingValue}>{rating.rating5 || 0}</span>
              <button
                onClick={() => handleIncrementRating("rating5")}
                className={styles.ratingButton}
              >
                +
              </button>
            </div>
            <div className={styles.ratingItem}>
              <span>Оценка 4:</span>
              <span className={styles.ratingValue}>{rating.rating4 || 0}</span>
              <button
                onClick={() => handleIncrementRating("rating4")}
                className={styles.ratingButton}
              >
                +
              </button>
            </div>
            <div className={styles.ratingItem}>
              <span>Оценка 3:</span>
              <span className={styles.ratingValue}>{rating.rating3 || 0}</span>
              <button
                onClick={() => handleIncrementRating("rating3")}
                className={styles.ratingButton}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className={styles.section}>
        <h2>Часто задаваемые вопросы</h2>
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <p className={styles.faqText}>{faq.text}</p>
              <div className={styles.faqMeta}>
                <span>От: {faq.user?.name || "Неизвестно"}</span>
                <span>
                  {new Date(faq.createdAt).toLocaleDateString()}
                </span>
                {(user?.data?.is_admin || faq.user_id === user?.data?.id) && (
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className={styles.deleteButton}
                  >
                    Удалить
                  </button>
                )}
              </div>
            </div>
          ))}
          {faqs.length === 0 && (
            <p className={styles.empty}>FAQ пока нет</p>
          )}
        </div>

        {/* Форма добавления FAQ */}
        {user?.status === "logged" && (
          <form onSubmit={handleCreateFaq} className={styles.faqForm}>
            <textarea
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              placeholder="Добавить вопрос..."
              className={styles.faqTextarea}
              rows="3"
            />
            <button type="submit" className={styles.submitButton}>
              Добавить FAQ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
