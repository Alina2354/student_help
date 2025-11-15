import { useState, useEffect } from "react";
import TeacherApi from "../../entites/teacher/api/TeacherApi";
import DisciplineApi from "../../entites/discipline/api/DisciplineApi";
import FaqApi from "../../entites/faq/api/FaqApi";
import GradeRequirementsApi from "../../entites/gradeRequirements/api/GradeRequirementsApi";
import axiosInstance from "../../shared/lib/axiosInstace";
import styles from "./AdminPage.module.css";

export default function AdminPage({ user }) {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [disciplines, setDisciplines] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Формы
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showDisciplineForm, setShowDisciplineForm] = useState(false);
  const [showRequirementsForm, setShowRequirementsForm] = useState(false);

  const [editingTeacher, setEditingTeacher] = useState(null);

  const [teacherForm, setTeacherForm] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    faculty: "",
    department: "",
  });

  const [teacherAvatar, setTeacherAvatar] = useState(null);

  const [disciplineForm, setDisciplineForm] = useState({
    teacher_id: "",
    title: "",
    semester: "",
  });

  const [requirementsForm, setRequirementsForm] = useState({
    teacher_id: "",
    discipline_id: "",
    semester: "",
    requirements_5: "",
    requirements_4: "",
    requirements_3: "",
  });

  // Модалка ответа
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [currentFaqId, setCurrentFaqId] = useState(null);
  const [modalAnswerText, setModalAnswerText] = useState("");

  // ==== LOAD ALL DATA =====================================================
  useEffect(() => {
    if (user?.data?.is_admin) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [teachersRes, faqsRes] = await Promise.all([
        TeacherApi.getAllTeachers(),
        FaqApi.getAllFaqs(),
      ]);

      if (teachersRes.statusCode === 200) setTeachers(teachersRes.data || []);
      if (faqsRes.statusCode === 200) setFaqs(faqsRes.data || []);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDisciplines = async (teacherId) => {
    try {
      const res = await DisciplineApi.getDisciplinesByTeacherId(teacherId);
      if (res.statusCode === 200) setDisciplines(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ==== TEACHER CRUD ======================================================
  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await TeacherApi.createTeacher(teacherForm, teacherAvatar);
      if (response.statusCode === 201) {
        setShowTeacherForm(false);
        setTeacherAvatar(null);
        setTeacherForm({
          first_name: "",
          last_name: "",
          middle_name: "",
          faculty: "",
          department: "",
        });
        loadData();
      }
    } catch (err) {
      alert("Ошибка создания преподавателя");
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await TeacherApi.updateTeacher(
        editingTeacher.id,
        teacherForm,
        teacherAvatar
      );
      if (response.statusCode === 200) {
        setShowTeacherForm(false);
        setEditingTeacher(null);
        loadData();
      }
    } catch (err) {
      alert("Ошибка обновления преподавателя");
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Удалить преподавателя?")) return;

    try {
      const res = await TeacherApi.deleteTeacher(id);
      if (res.statusCode === 200) loadData();
    } catch {
      alert("Ошибка удаления");
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      middle_name: teacher.middle_name || "",
      faculty: teacher.faculty || "",
      department: teacher.department || "",
    });
    setShowTeacherForm(true);
    setSelectedTeacher(teacher);
    loadDisciplines(teacher.id);
  };

  // ==== DISCIPLINES ======================================================
  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      const res = await DisciplineApi.createDiscipline({
        teacher_id: Number(disciplineForm.teacher_id),
        title: disciplineForm.title,
        semester: Number(disciplineForm.semester),
      });

      if (res.statusCode === 201) {
        setShowDisciplineForm(false);
        loadDisciplines(selectedTeacher.id);
        loadData();
      }
    } catch {
      alert("Ошибка при создании дисциплины");
    }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!window.confirm("Удалить дисциплину?")) return;

    try {
      const res = await DisciplineApi.deleteDiscipline(id);
      if (res.statusCode === 200) {
        loadDisciplines(selectedTeacher.id);
        loadData();
      }
    } catch {
      alert("Ошибка удаления дисциплины");
    }
  };

  // ==== REQUIREMENTS ======================================================
  const handleCreateRequirements = async (e) => {
    e.preventDefault();
    try {
      const res = await GradeRequirementsApi.createRequirements(requirementsForm);
      if (res.statusCode === 201) {
        setShowRequirementsForm(false);
        loadData();
      }
    } catch {
      alert("Ошибка");
    }
  };

  // ==== FAQ ======================================================
  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Удалить отзыв?")) return;

    try {
      const res = await FaqApi.deleteFaq(id);
      if (res.statusCode === 200) loadData();
    } catch {
      alert("Ошибка удаления FAQ");
    }
  };

  const openAnswerModal = (faqId) => {
    setCurrentFaqId(faqId);
    setShowAnswerModal(true);
    setModalAnswerText("");
  };

  const submitAnswer = async () => {
    if (!modalAnswerText.trim()) return;

    try {
      const res = await FaqApi.addAnswerToFaq(currentFaqId, modalAnswerText.trim());
      if (res.statusCode === 200) {
        setShowAnswerModal(false);
        loadData();
      }
    } catch {
      alert("Ошибка добавления ответа");
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return axiosInstance.defaults.baseURL + path;
  };

  if (!user?.data?.is_admin) return <div className={styles.error}>Доступ запрещён</div>;
  if (isLoading) return <div className={styles.loading}>Загрузка…</div>;

  return (
    <div className={styles.container}>
      
      {/* ======================= HEADER ======================= */}
      <h1 className={styles.title}>Админ-панель</h1>

      {/* ======================= TEACHERS ======================= */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Преподаватели</h2>
          <button
            className={styles.addButton}
            onClick={() => {
              setEditingTeacher(null);
              setTeacherForm({
                first_name: "",
                last_name: "",
                middle_name: "",
                faculty: "",
                department: "",
              });
              setShowTeacherForm(true);
            }}
          >
            + Добавить преподавателя
          </button>
        </div>

        {showTeacherForm && (
          <form
            onSubmit={editingTeacher ? handleUpdateTeacher : handleCreateTeacher}
            className={styles.form}
          >
            <span
              className={styles.closeX}
              onClick={() => setShowTeacherForm(false)}
            >
              ✕
            </span>

            <h3>{editingTeacher ? "Редактировать" : "Создать"} преподавателя</h3>

            <input
              className={styles.input}
              placeholder="Имя"
              value={teacherForm.first_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, first_name: e.target.value })
              }
            />

            <input
              className={styles.input}
              placeholder="Фамилия"
              value={teacherForm.last_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, last_name: e.target.value })
              }
            />

            <input
              className={styles.input}
              placeholder="Отчество"
              value={teacherForm.middle_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, middle_name: e.target.value })
              }
            />

            <input
              className={styles.input}
              placeholder="Факультет"
              value={teacherForm.faculty}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, faculty: e.target.value })
              }
            />

            <input
              className={styles.input}
              placeholder="Кафедра"
              value={teacherForm.department}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, department: e.target.value })
              }
            />

            <label className={styles.fileLabel}>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={(e) => setTeacherAvatar(e.target.files[0])}
              />
              {teacherAvatar ? teacherAvatar.name : "Загрузить аватар"}
            </label>

            <button className={styles.submitButton}>
              {editingTeacher ? "Обновить" : "Создать"}
            </button>
          </form>
        )}

        <div className={styles.teachersList}>
          {teachers.map((t) => (
            <div key={t.id} className={styles.teacherCard}>
              <span
                className={styles.cardCloseX}
                onClick={() => handleDeleteTeacher(t.id)}
              >
                ✕
              </span>

              <div className={styles.teacherRow}>
                {t.avatar && (
                  <img
                    className={styles.teacherAvatar}
                    src={getAvatarUrl(t.avatar)}
                    alt=""
                  />
                )}

                <div>
                  <div className={styles.teacherName}>
                    {t.last_name} {t.first_name}
                  </div>
                </div>
              </div>

              <button
                className={styles.editButton}
                onClick={() => handleEditTeacher(t)}
              >
                Редактировать
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ======================= DISCIPLINES ======================= */}
      {selectedTeacher && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>
              Дисциплины: {selectedTeacher.last_name} {selectedTeacher.first_name}
            </h2>

            <button
              className={styles.addButton}
              onClick={() => {
                setDisciplineForm({
                  teacher_id: selectedTeacher.id,
                  title: "",
                  semester: "",
                });
                setShowDisciplineForm(true);
              }}
            >
              + Добавить дисциплину
            </button>
          </div>

          {showDisciplineForm && (
            <form onSubmit={handleCreateDiscipline} className={styles.form}>
              <span
                className={styles.closeX}
                onClick={() => setShowDisciplineForm(false)}
              >
                ✕
              </span>

              <h3>Создать дисциплину</h3>

              <input
                className={styles.input}
                placeholder="Название"
                value={disciplineForm.title}
                onChange={(e) =>
                  setDisciplineForm({ ...disciplineForm, title: e.target.value })
                }
              />

              <input
                className={styles.input}
                placeholder="Семестр"
                value={disciplineForm.semester}
                onChange={(e) =>
                  setDisciplineForm({
                    ...disciplineForm,
                    semester: e.target.value,
                  })
                }
              />

              <button className={styles.submitButton}>Создать</button>
            </form>
          )}

          <div className={styles.disciplinesList}>
            {disciplines.map((d) => (
              <div key={d.id} className={styles.disciplineCard}>
                <span
                  className={styles.cardCloseX}
                  onClick={() => handleDeleteDiscipline(d.id)}
                >
                  ✕
                </span>

                <div className={styles.disciplineTitle}>{d.title}</div>
                <div className={styles.disciplineSemester}>
                  Семестр: {d.semester}
                </div>
              </div>
            ))}
          </div>

          {/* ======================= REQUIREMENTS ======================= */}

          <div className={styles.sectionHeader}>
            <h2>Требования к оценкам</h2>

            <button
              className={styles.addButton}
              onClick={() => {
                setRequirementsForm({
                  teacher_id: selectedTeacher.id,
                  discipline_id: "",
                  semester: "",
                  requirements_5: "",
                  requirements_4: "",
                  requirements_3: "",
                });
                setShowRequirementsForm(true);
              }}
            >
              + Добавить требования
            </button>
          </div>

          {showRequirementsForm && (
            <form onSubmit={handleCreateRequirements} className={styles.form}>
              <span
                className={styles.closeX}
                onClick={() => setShowRequirementsForm(false)}
              >
                ✕
              </span>

              <h3>Создать требования</h3>

              <select
                className={styles.input}
                value={requirementsForm.discipline_id}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    discipline_id: e.target.value,
                  })
                }
              >
                <option value="">Выбрать дисциплину</option>
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>

              <textarea
                className={styles.textarea}
                placeholder="Требования на 5"
                value={requirementsForm.requirements_5}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_5: e.target.value,
                  })
                }
              />

              <textarea
                className={styles.textarea}
                placeholder="Требования на 4"
                value={requirementsForm.requirements_4}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_4: e.target.value,
                  })
                }
              />

              <textarea
                className={styles.textarea}
                placeholder="Требования на 3"
                value={requirementsForm.requirements_3}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_3: e.target.value,
                  })
                }
              />

              <button className={styles.submitButton}>Сохранить</button>
            </form>
          )}
        </div>
      )}

      {/* ======================= FAQ (ALL) ======================= */}
      <div className={styles.section}>
        <h2>Все FAQ</h2>

        <div className={styles.faqList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqCard}>
              <span
                className={styles.cardCloseX}
                onClick={() => handleDeleteFaq(faq.id)}
              >
                ✕
              </span>

              <div className={styles.faqQuestion}>
                <strong>Вопрос:</strong> {faq.text}
              </div>

              {faq.answer ? (
                <div className={styles.faqAnswer}>
                  <strong>Ответ:</strong> {faq.answer}
                </div>
              ) : (
                <button
                  className={styles.answerButton}
                  onClick={() => openAnswerModal(faq.id)}
                >
                  Ответить
                </button>
              )}

              <div className={styles.faqMeta}>
                <span>
                  Преподаватель: {faq.teacher?.last_name} {faq.teacher?.first_name}
                </span>
                <span>От: {faq.user?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================= MODAL ANSWER ======================= */}
      {showAnswerModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalAnswer}>
            <span
              className={styles.modalClose}
              onClick={() => setShowAnswerModal(false)}
            >
              ✕
            </span>

            <h3>Ответ на вопрос</h3>

            <textarea
              className={styles.modalTextarea}
              value={modalAnswerText}
              onChange={(e) => setModalAnswerText(e.target.value)}
              placeholder="Введите ответ…"
            />

            <button className={styles.modalSubmit} onClick={submitAnswer}>
              Отправить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
