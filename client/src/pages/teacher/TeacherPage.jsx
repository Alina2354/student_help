import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import axiosInstance from "../../shared/lib/axiosInstace";
import styles from "./TeacherPage.module.css";

export default function TeacherPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const response = await TeacherApi.getTeacherById(id);

      if (response.statusCode === 200) {
        setTeacher(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = teacher?.avatar
    ? teacher.avatar.startsWith("http")
      ? teacher.avatar
      : axiosInstance.defaults.baseURL + teacher.avatar
    : "/placeholder-avatar.png";

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!teacher) return <div className={styles.error}>Преподаватель не найден</div>;

  return (
    <div className={styles.cont}>

      {/* НАЗАД */}
      <button className={styles.back} onClick={() => navigate(-1)}>
        <img src="/Frame 2131331668.svg" alt="back" />
      </button>

      <main className={styles.teacherPage}>

        {/* ШАПКА */}
        <section className={styles.teacherHeader}>
          <img src={avatarUrl} alt="" className={styles.teacherAvatar} />

          <div className={styles.teacherInfo}>
            <h1>
              {teacher.last_name} {teacher.first_name} {teacher.middle_name}
            </h1>
            <p className={styles.teacherSubtitle}>
              {teacher.faculty}
              {teacher.department ? `, ${teacher.department}` : ""}
            </p>
          </div>
        </section>

        {/* ФИЛЬТРЫ (пока статичные) */}
        <div className={styles.filters}>
          <button className={styles.filterBtn}>
            Семестр <img src="/CaretDown.svg" />
          </button>

          <button className={styles.filterBtn}>
            Предмет <img src="/CaretDown.svg" />
          </button>
        </div>

        {/* КОНТЕНТ */}
        <div className={styles.contentContainer}>

          {/* ДИСЦИПЛИНЫ + ТРЕБОВАНИЯ */}
          {teacher.disciplines?.map((d) => {
            const req = teacher.gradeRequirements?.find(
              (r) => r.discipline_id === d.id
            );

            return (
              <div key={d.id} className={styles.requirementsSection}>
                <h3>{d.title} (семестр {d.semester})</h3>

                {req ? (
                  <>
                    <h4 className={styles.requireHeader}>Требования на 3:</h4>
                    <p>{req.requirements_3}</p>

                    <h4 className={styles.requireHeader}>Требования на 4:</h4>
                    <p>{req.requirements_4}</p>

                    <h4 className={styles.requireHeader}>Требования на 5:</h4>
                    <p>{req.requirements_5}</p>
                  </>
                ) : (
                  <p>Требования отсутствуют</p>
                )}
              </div>
            );
          })}

          {/* FAQ */}
          {teacher.faqs?.length > 0 && (
            <>
              <h2 className={styles.faqHeader}>FAQ</h2>

              {teacher.faqs.map((item) => (
                <div key={item.id} className={styles.faqItem}>
                  <button
                    className={styles.faqQuestion}
                    onClick={() =>
                      setOpenFaq(openFaq === item.id ? null : item.id)
                    }
                  >
                    {item.text}
                    <span className={styles.arrow}>
                      {openFaq === item.id ? "▲" : "▼"}
                    </span>
                  </button>

                  <div
                    className={`${styles.faqAnswer} ${
                      openFaq === item.id ? styles.active : ""
                    }`}
                  >
                    <p>{item.answer || "Ответ отсутствует"}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Кнопка отзывов */}
        <button className={styles.btnReview}>Оставить отзыв</button>
      </main>
    </div>
  );
}
