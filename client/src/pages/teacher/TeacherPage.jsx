import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import FaqApi from "../../entites/faq/api/FaqApi";
import axiosInstance from "../../shared/lib/axiosInstace";
import styles from "./TeacherPage.module.css";

export default function TeacherPage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openFaq, setOpenFaq] = useState(null);
  const [faqText, setFaqText] = useState("");
  const [faqFile, setFaqFile] = useState(null);

  // фильтр
  const [selectedSemester, setSelectedSemester] = useState("all");

  useEffect(() => {
    loadTeacher();
  }, []);

  const loadTeacher = async () => {
    try {
      const res = await TeacherApi.getTeacherById(id);

      if (res.statusCode === 200) {
        setTeacher(res.data);
      }
    } catch (e) {
      console.error("Ошибка загрузки:", e);
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = teacher?.avatar
    ? teacher.avatar.startsWith("http")
      ? teacher.avatar
      : axiosInstance.defaults.baseURL + teacher.avatar
    : "/placeholder-avatar.png";

  // создание FAQ с файлом
  const handleCreateFaq = async () => {
    if (!faqText.trim()) return;

    try {
      const formData = new FormData();
      formData.append("teacher_id", id);
      formData.append("text", faqText.trim());

      if (faqFile) {
        formData.append("file", faqFile);
      }

      const response = await FaqApi.createFaq(formData);

      if (response.statusCode === 201) {
        setFaqText("");
        setFaqFile(null);
        // Сбрасываем input файла
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        loadTeacher();
      }
    } catch (err) {
      console.error("Ошибка FAQ:", err);
      alert("Ошибка при создании отзыва");
    }
  };

  // удаление FAQ
  const handleDeleteFaq = async (faqId) => {
    try {
      await FaqApi.deleteFaq(faqId);
      loadTeacher();
    } catch (err) {
      console.error("Ошибка удаления", err);
    }
  };

  // скачивание файла
  const handleDownloadFile = (faqId, filePath) => {
    if (!filePath) return;

    const fileUrl = filePath.startsWith("http")
      ? filePath
      : `${axiosInstance.defaults.baseURL}${filePath}`;

    // Для изображений открываем в новой вкладке, для остальных - скачиваем
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(filePath);
    
    if (isImage) {
      window.open(fileUrl, "_blank");
    } else {
      // Используем download endpoint для документов
      const downloadUrl = FaqApi.getFileDownloadUrl(faqId);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filePath.split("/").pop() || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return "📎";
    const ext = filePath.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    return "📎";
  };

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (!teacher) return <div className={styles.error}>Преподаватель не найден</div>;

  // семестры
  const semesters = [...new Set(teacher.disciplines.map((d) => d.semester))].sort();

  // дисциплины после фильтра
  const filteredDisciplines =
    selectedSemester === "all"
      ? teacher.disciplines
      : teacher.disciplines.filter((d) => d.semester === Number(selectedSemester));

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

        {/* ====== ФИЛЬТР ПО СЕМЕСТРУ ====== */}
        <div className={styles.filterContainer}>
          <select
            className={styles.filterSelect}
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="all">Все семестры</option>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s} семестр
              </option>
            ))}
          </select>
        </div>

        {/* ===================== REQUIREMENTS ===================== */}
        <h2 className={styles.requireMainHeader}>Требования к оценкам</h2>

        {filteredDisciplines.map((d) => {
          const req = teacher.gradeRequirements?.find(
            (r) => r.discipline_id === d.id
          );

          return (
            <div key={d.id} className={styles.requirementsSection}>
              <h3 className={styles.requireDiscipline}>
                {d.title} (семестр {d.semester})
              </h3>

              {req ? (
                <>
                  <h4 className={styles.requireHeader}>Требования на 3:</h4>
                  <p className={styles.requireText}>{req.requirements_3}</p>

                  <h4 className={styles.requireHeader}>Требования на 4:</h4>
                  <p className={styles.requireText}>{req.requirements_4}</p>

                  <h4 className={styles.requireHeader}>Требования на 5:</h4>
                  <p className={styles.requireText}>{req.requirements_5}</p>
                </>
              ) : (
                <p className={styles.requireText}>Требования отсутствуют</p>
              )}
            </div>
          );
        })}

        {/* ===================== FAQ ===================== */}
        <h2 className={styles.faqHeader}>FAQ</h2>

        {teacher.faqs?.map((item) => {
          const canDelete =
            user?.data?.is_admin || user?.data?.id === item.user_id;

          const hasAnswer = Boolean(item.answer);

          return (
            <div key={item.id} className={styles.faqItem}>
              {/* ====== КНОПКА С ВОПРОСОМ ====== */}
              <button
                className={styles.faqQuestion}
                onClick={() =>
                  hasAnswer ? setOpenFaq(openFaq === item.id ? null : item.id) : null
                }
              >
                {item.text}

                <div className={styles.faqRight}>
                  {/* стрелка только если есть answer */}
                  {hasAnswer && (
                    <span>{openFaq === item.id ? "▲" : "▼"}</span>
                  )}

                  {/* крестик справа, если answer НЕТ */}
                  {!hasAnswer && canDelete && (
                    <button
                      className={styles.deleteBtnInline}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFaq(item.id);
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </button>

              {/* ====== РАСКРЫВАЮЩИЙСЯ БЛОК ====== */}
              {hasAnswer && (
                <div
                  className={`${styles.faqAnswer} ${
                    openFaq === item.id ? styles.active : ""
                  }`}
                >
                  <p>{item.answer}</p>

                  {/* Отображение файла, если есть */}
                  {item.file_path && (
                    <div className={styles.faqFileSection}>
                      <button
                        className={styles.downloadButton}
                        onClick={() => handleDownloadFile(item.id, item.file_path)}
                        title="Скачать файл"
                      >
                        {getFileIcon(item.file_path)} Скачать документ
                      </button>
                      {/* Превью для изображений */}
                      {item.file_path.match(/\.(jpg|jpeg|png|gif)$/i) && (
                        <div className={styles.filePreview}>
                          <img
                            src={
                              item.file_path.startsWith("http")
                                ? item.file_path
                                : `${axiosInstance.defaults.baseURL}${item.file_path}`
                            }
                            alt="Превью"
                            className={styles.previewImage}
                            onClick={() => handleDownloadFile(item.id, item.file_path)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {canDelete && (
                    <button
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteFaq(item.id)}
                    >
                      ✕
                    </button>
                  )}
                </div>
              )}

              {/* Отображение файла для вопросов без ответа */}
              {!hasAnswer && item.file_path && (
                <div className={styles.faqFileSectionNoAnswer}>
                  <button
                    className={styles.downloadButton}
                    onClick={() => handleDownloadFile(item.id, item.file_path)}
                    title="Скачать файл"
                  >
                    {getFileIcon(item.file_path)} Скачать документ
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ================ Добавить отзыв ================ */}
        {user?.status === "logged" && (
          <div className={styles.reviewForm}>
            <textarea
              id="faqTextArea"
              className={styles.textarea}
              placeholder="Написать отзыв…"
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
            />

            {/* Input для файла */}
            <div className={styles.fileUploadSection}>
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className={styles.fileInput}
                  onChange={(e) => setFaqFile(e.target.files[0])}
                />
                <span className={styles.fileLabelText}>
                  {faqFile ? `Выбран: ${faqFile.name}` : "📎 Прикрепить документ"}
                </span>
              </label>
              {faqFile && (
                <button
                  type="button"
                  className={styles.removeFileButton}
                  onClick={() => {
                    setFaqFile(null);
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) fileInput.value = "";
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <button className={styles.btnReview} onClick={handleCreateFaq}>
              Оставить отзыв
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
