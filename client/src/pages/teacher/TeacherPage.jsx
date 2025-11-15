import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import DisciplineApi from "../../entites/discipline/api/DisciplineApi";
import TeacherRatingApi from "../../entites/teacherRating/api/TeacherRatingApi";
import FaqApi from "../../entites/faq/api/FaqApi";
import GradeRequirementsApi from "../../entites/gradeRequirements/api/GradeRequirementsApi";
import axiosInstance from "../../shared/lib/axiosInstace";
import styles from "./TeacherPage.module.css";

export default function TeacherPage({ user }) {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [rating, setRating] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedDiscipline, setSelectedDiscipline] = useState("all");
  const [gradeRequirements, setGradeRequirements] = useState(null);
  const [faqText, setFaqText] = useState("");
  const [faqFile, setFaqFile] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
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

  useEffect(() => {
    if (selectedSemester !== "all" && selectedDiscipline !== "all") {
      loadGradeRequirements();
    } else {
      setGradeRequirements(null);
    }
  }, [selectedSemester, selectedDiscipline]);

  const loadTeacherData = async () => {
    try {
      setIsLoading(true);
      const [teacherRes, ratingRes, faqsRes] = await Promise.all([
        TeacherApi.getTeacherById(id),
        TeacherRatingApi.getRatingByTeacherId(id),
        FaqApi.getFaqsByTeacherId(id),
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

      // Проверяем, голосовал ли пользователь
      if (user?.status === "logged" && user?.data?.id) {
        checkUserVote();
      }
    } catch (err) {
      setError("Ошибка загрузки данных");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserVote = async () => {
    try {
      // Проверяем через API, голосовал ли пользователь
      // Это можно сделать через отдельный endpoint или проверить в incrementRating
      // Пока используем простую проверку - если пользователь не админ, считаем что может голосовать только раз
      setHasVoted(false);
    } catch (err) {
      console.error("Ошибка проверки голоса:", err);
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

  const loadGradeRequirements = async () => {
    try {
      const response =
        await GradeRequirementsApi.getRequirementsByTeacherAndDiscipline(
          id,
          selectedDiscipline,
          parseInt(selectedSemester)
        );
      if (response.statusCode === 200) {
        setGradeRequirements(response.data);
      } else {
        setGradeRequirements(null);
      }
    } catch (err) {
      console.error("Ошибка загрузки требований:", err);
      setGradeRequirements(null);
    }
  };

  const handleIncrementRating = async (ratingType) => {
    try {
      const response = await TeacherRatingApi.incrementRating(id, ratingType);
      if (response.statusCode === 200) {
        setRating(response.data);
        setHasVoted(true);
        if (user?.data?.is_admin) {
          // Админ может голосовать заново
          setHasVoted(false);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Ошибка при оценке";
      if (errorMessage.includes("уже проголосовали")) {
        setHasVoted(true);
      }
      alert(errorMessage);
      console.error(err);
    }
  };

  const handleCreateFaq = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // <-- важно, чтобы форма не стреляла два раза

    const formData = new FormData();
    formData.append("teacher_id", id);
    formData.append("text", faqText);

    if (faqFile) {
      formData.append("file", faqFile);
    }

    try {
      const response = await FaqApi.createFaq(formData);

      if (response.statusCode === 201) {
        setFaqText("");
        setFaqFile(null);
        loadTeacherData();
      }
    } catch (err) {
      console.error("Ошибка FAQ:", err);
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

  const handleFileDownload = (faqId, filePath) => {
    if (!filePath) {
      // Если нет пути, используем download endpoint
      const downloadUrl = FaqApi.getFileDownloadUrl(faqId);
      window.open(downloadUrl, "_blank");
      return;
    }

    // Используем прямой URL к файлу через статику
    const fileUrl = filePath.startsWith("http")
      ? filePath
      : `${axiosInstance.defaults.baseURL}${filePath}`;

    // Создаем временную ссылку для скачивания
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filePath.split("/").pop() || "file";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${axiosInstance.defaults.baseURL}${filePath}`;
  };

  const getFileIcon = (filePath) => {
    if (!filePath) return "📎";
    const ext = filePath.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "🖼️";
    if (ext === "pdf") return "📄";
    if (["doc", "docx"].includes(ext)) return "📝";
    return "📎";
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `${axiosInstance.defaults.baseURL}${avatarPath}`;
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !teacher) {
    return (
      <div className={styles.error}>{error || "Преподаватель не найден"}</div>
    );
  }

  const semesters = teacher.disciplines
    ? [...new Set(teacher.disciplines.map((d) => d.semester))].sort()
    : [];

  const availableDisciplines = disciplines.filter(
    (d) =>
      selectedSemester === "all" || d.semester === parseInt(selectedSemester)
  );

  return (
    <div className={styles.container}>
      {/* Информация о преподавателе */}
      <div className={styles.teacherInfo}>
        {teacher.avatar && (
          <div className={styles.avatarContainer}>
            <img
              src={getAvatarUrl(teacher.avatar)}
              alt="Аватар"
              className={styles.avatar}
            />
          </div>
        )}
        <div>
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
      </div>

      {/* Дисциплины */}
      <div className={styles.section}>
        <h2>Дисциплины</h2>
        <div className={styles.filters}>
          <div className={styles.filter}>
            <label>
              Семестр:
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedDiscipline("all");
                }}
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
          <div className={styles.filter}>
            <label>
              Предмет:
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className={styles.select}
                disabled={selectedSemester === "all"}
              >
                <option value="all">Все</option>
                {availableDisciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
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

      {/* Требования к оценкам */}
      {selectedSemester !== "all" && selectedDiscipline !== "all" && (
        <div className={styles.section}>
          <h2>Требования к оценкам</h2>
          {gradeRequirements ? (
            <div className={styles.requirements}>
              <div className={styles.requirementItem}>
                <h3>Требования на 5</h3>
                <p>{gradeRequirements.requirements_5 || "Не указано"}</p>
              </div>
              <div className={styles.requirementItem}>
                <h3>Требования на 4</h3>
                <p>{gradeRequirements.requirements_4 || "Не указано"}</p>
              </div>
              <div className={styles.requirementItem}>
                <h3>Требования на 3</h3>
                <p>{gradeRequirements.requirements_3 || "Не указано"}</p>
              </div>
            </div>
          ) : (
            <p className={styles.empty}>
              Требования не указаны для выбранной дисциплины и семестра
            </p>
          )}
        </div>
      )}

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
                disabled={hasVoted && !user?.data?.is_admin}
                title={
                  hasVoted && !user?.data?.is_admin
                    ? "Вы уже проголосовали"
                    : ""
                }
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
                disabled={hasVoted && !user?.data?.is_admin}
                title={
                  hasVoted && !user?.data?.is_admin
                    ? "Вы уже проголосовали"
                    : ""
                }
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
                disabled={hasVoted && !user?.data?.is_admin}
                title={
                  hasVoted && !user?.data?.is_admin
                    ? "Вы уже проголосовали"
                    : ""
                }
              >
                +
              </button>
            </div>
          </div>
        )}
        {hasVoted && !user?.data?.is_admin && (
          <p className={styles.voteWarning}>
            Вы уже проголосовали за этого преподавателя
          </p>
        )}
      </div>

      {/* FAQ */}
      <div className={styles.section}>
        <h2>Часто задаваемые вопросы</h2>
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <p className={styles.faqText}>{faq.text}</p>
              {faq.file_path && (
                <div className={styles.faqFile}>
                  <button
                    onClick={() => handleFileDownload(faq.id, faq.file_path)}
                    className={styles.downloadButton}
                    title="Скачать файл"
                  >
                    {getFileIcon(faq.file_path)} Скачать файл
                  </button>
                  {/* Показываем превью для изображений */}
                  {faq.file_path.match(/\.(jpg|jpeg|png|gif)$/i) && (
                    <div className={styles.filePreview}>
                      <img
                        src={getFileUrl(faq.file_path)}
                        alt="Превью"
                        className={styles.previewImage}
                        onClick={() =>
                          handleFileDownload(faq.id, faq.file_path)
                        }
                      />
                    </div>
                  )}
                </div>
              )}
              <div className={styles.faqMeta}>
                <span>От: {faq.user?.name || "Неизвестно"}</span>
                <span>{new Date(faq.createdAt).toLocaleDateString()}</span>
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
          {faqs.length === 0 && <p className={styles.empty}>FAQ пока нет</p>}
        </div>

        {/* Форма добавления FAQ */}
        {user?.status === "logged" && (
          <form
            onSubmit={handleCreateFaq}
            className={styles.faqForm}
            encType="multipart/form-data"
          >
            <textarea
              value={faqText}
              onChange={(e) => setFaqText(e.target.value)}
              placeholder="Добавить вопрос..."
              className={styles.faqTextarea}
              rows="3"
              required
            />
            <div className={styles.fileUpload}>
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  name="file"
                  onChange={(e) => setFaqFile(e.target.files[0])}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className={styles.fileInput}
                />
                {faqFile
                  ? `Выбран: ${faqFile.name}`
                  : "Прикрепить файл (PDF, DOC, DOCX, JPG, PNG)"}
              </label>
              {faqFile && (
                <button
                  type="button"
                  onClick={() => {
                    setFaqFile(null);
                    // Сбрасываем input
                    const fileInput =
                      document.querySelector('input[name="file"]');
                    if (fileInput) fileInput.value = "";
                  }}
                  className={styles.removeFileButton}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className={styles.submitButton}>
              Добавить FAQ
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
