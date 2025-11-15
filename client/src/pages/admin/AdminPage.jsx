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
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showDisciplineForm, setShowDisciplineForm] = useState(false);
  const [showRequirementsForm, setShowRequirementsForm] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Формы
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

  useEffect(() => {
    if (user?.data?.is_admin) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [teachersRes, faqsRes] = await Promise.all([
        TeacherApi.getAllTeachers(),
        FaqApi.getAllFaqs(),
      ]);

      if (teachersRes.statusCode === 200) {
        setTeachers(teachersRes.data || []);
      }
      if (faqsRes.statusCode === 200) {
        setFaqs(faqsRes.data || []);
      }
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDisciplines = async (teacherId) => {
    try {
      const response = await DisciplineApi.getDisciplinesByTeacherId(teacherId);
      if (response.statusCode === 200) {
        setDisciplines(response.data || []);
      }
    } catch (err) {
      console.error("Ошибка загрузки дисциплин:", err);
    }
  };

  const handleCreateTeacher = async (e) => {
    e.preventDefault();
    try {
      const response = await TeacherApi.createTeacher(
        teacherForm,
        teacherAvatar
      );
      if (response.statusCode === 201) {
        setShowTeacherForm(false);
        setTeacherForm({
          first_name: "",
          last_name: "",
          middle_name: "",
          faculty: "",
          department: "",
        });
        setTeacherAvatar(null);
        loadData();
      }
    } catch (err) {
      alert("Ошибка при создании преподавателя");
      console.error(err);
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
        setEditingTeacher(null);
        setShowTeacherForm(false);
        setTeacherForm({
          first_name: "",
          last_name: "",
          middle_name: "",
          faculty: "",
          department: "",
        });
        setTeacherAvatar(null);
        loadData();
      }
    } catch (err) {
      alert("Ошибка при обновлении преподавателя");
      console.error(err);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Удалить преподавателя?")) return;

    try {
      const response = await TeacherApi.deleteTeacher(id);
      if (response.statusCode === 200) {
        loadData();
      }
    } catch (err) {
      alert("Ошибка при удалении преподавателя");
      console.error(err);
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
    setTeacherAvatar(null);
    setShowTeacherForm(true);
    loadDisciplines(teacher.id);
    setSelectedTeacher(teacher);
  };

  const handleCreateDiscipline = async (e) => {
    e.preventDefault();
    try {
      const response = await DisciplineApi.createDiscipline({
        teacher_id: parseInt(disciplineForm.teacher_id),
        title: disciplineForm.title,
        semester: parseInt(disciplineForm.semester),
      });
      if (response.statusCode === 201) {
        setShowDisciplineForm(false);
        setDisciplineForm({
          teacher_id: "",
          title: "",
          semester: "",
        });
        if (selectedTeacher) {
          loadDisciplines(selectedTeacher.id);
        }
        loadData();
      }
    } catch (err) {
      alert("Ошибка при создании дисциплины");
      console.error(err);
    }
  };

  const handleDeleteDiscipline = async (id) => {
    if (!window.confirm("Удалить дисциплину?")) return;

    try {
      const response = await DisciplineApi.deleteDiscipline(id);
      if (response.statusCode === 200) {
        if (selectedTeacher) {
          loadDisciplines(selectedTeacher.id);
        }
        loadData();
      }
    } catch (err) {
      alert("Ошибка при удалении дисциплины");
      console.error(err);
    }
  };

  const handleCreateRequirements = async (e) => {
    e.preventDefault();
    try {
      const response = await GradeRequirementsApi.createRequirements(
        requirementsForm
      );
      if (response.statusCode === 201) {
        setShowRequirementsForm(false);
        setRequirementsForm({
          teacher_id: "",
          discipline_id: "",
          semester: "",
          requirements_5: "",
          requirements_4: "",
          requirements_3: "",
        });
        loadData();
      }
    } catch (err) {
      alert("Ошибка при создании требований");
      console.error(err);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm("Удалить FAQ?")) return;

    try {
      const response = await FaqApi.deleteFaq(id);
      if (response.statusCode === 200) {
        loadData();
      }
    } catch (err) {
      alert("Ошибка при удалении FAQ");
      console.error(err);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;
    return `${axiosInstance.defaults.baseURL}${avatarPath}`;
  };

  if (!user?.data?.is_admin) {
    return <div className={styles.error}>Доступ запрещен</div>;
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ-панель</h1>

      {/* Преподаватели */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Преподаватели</h2>
          <button
            onClick={() => {
              setEditingTeacher(null);
              setTeacherForm({
                first_name: "",
                last_name: "",
                middle_name: "",
                faculty: "",
                department: "",
              });
              setTeacherAvatar(null);
              setShowTeacherForm(true);
            }}
            className={styles.addButton}
          >
            + Добавить преподавателя
          </button>
        </div>

        {showTeacherForm && (
          <form
            onSubmit={
              editingTeacher ? handleUpdateTeacher : handleCreateTeacher
            }
            className={styles.form}
          >
            <h3>
              {editingTeacher ? "Редактировать" : "Создать"} преподавателя
            </h3>
            <input
              type="text"
              placeholder="Имя"
              value={teacherForm.first_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, first_name: e.target.value })
              }
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={teacherForm.last_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, last_name: e.target.value })
              }
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Отчество"
              value={teacherForm.middle_name}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, middle_name: e.target.value })
              }
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Факультет"
              value={teacherForm.faculty}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, faculty: e.target.value })
              }
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Кафедра"
              value={teacherForm.department}
              onChange={(e) =>
                setTeacherForm({ ...teacherForm, department: e.target.value })
              }
              className={styles.input}
            />
            <div className={styles.fileUpload}>
              <label className={styles.fileLabel}>
                <input
                  type="file"
                  onChange={(e) => setTeacherAvatar(e.target.files[0])}
                  accept="image/*"
                  className={styles.fileInput}
                />
                {teacherAvatar
                  ? teacherAvatar.name
                  : editingTeacher?.avatar
                  ? "Изменить аватар"
                  : "Загрузить аватар"}
              </label>
              {teacherAvatar && (
                <button
                  type="button"
                  onClick={() => setTeacherAvatar(null)}
                  className={styles.removeFileButton}
                >
                  ✕
                </button>
              )}
            </div>
            {editingTeacher?.avatar && !teacherAvatar && (
              <div className={styles.currentAvatar}>
                <img
                  src={getAvatarUrl(editingTeacher.avatar)}
                  alt="Текущий аватар"
                  className={styles.avatarPreview}
                />
              </div>
            )}
            <div className={styles.formButtons}>
              <button type="submit" className={styles.submitButton}>
                {editingTeacher ? "Обновить" : "Создать"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTeacherForm(false);
                  setEditingTeacher(null);
                  setTeacherAvatar(null);
                }}
                className={styles.cancelButton}
              >
                Отмена
              </button>
            </div>
          </form>
        )}

        <div className={styles.teachersList}>
          {teachers.map((teacher) => (
            <div key={teacher.id} className={styles.teacherCard}>
              <div className={styles.teacherInfo}>
                {teacher.avatar && (
                  <img
                    src={getAvatarUrl(teacher.avatar)}
                    alt="Аватар"
                    className={styles.teacherAvatar}
                  />
                )}
                <div>
                  <h4>
                    {teacher.last_name} {teacher.first_name}{" "}
                    {teacher.middle_name || ""}
                  </h4>
                  {teacher.faculty && <p>Факультет: {teacher.faculty}</p>}
                  {teacher.department && <p>Кафедра: {teacher.department}</p>}
                </div>
              </div>
              <div className={styles.teacherActions}>
                <button
                  onClick={() => {
                    handleEditTeacher(teacher);
                  }}
                  className={styles.editButton}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteTeacher(teacher.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Дисциплины */}
      {selectedTeacher && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>
              Дисциплины: {selectedTeacher.last_name}{" "}
              {selectedTeacher.first_name}
            </h2>
            <button
              onClick={() => {
                setDisciplineForm({
                  teacher_id: selectedTeacher.id.toString(),
                  title: "",
                  semester: "",
                });
                setShowDisciplineForm(true);
              }}
              className={styles.addButton}
            >
              + Добавить дисциплину
            </button>
          </div>

          {showDisciplineForm && (
            <form onSubmit={handleCreateDiscipline} className={styles.form}>
              <h3>Создать дисциплину</h3>
              <input
                type="text"
                placeholder="Название дисциплины"
                value={disciplineForm.title}
                onChange={(e) =>
                  setDisciplineForm({
                    ...disciplineForm,
                    title: e.target.value,
                  })
                }
                required
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Семестр"
                value={disciplineForm.semester}
                onChange={(e) =>
                  setDisciplineForm({
                    ...disciplineForm,
                    semester: e.target.value,
                  })
                }
                required
                className={styles.input}
              />
              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>
                  Создать
                </button>
                <button
                  type="button"
                  onClick={() => setShowDisciplineForm(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}

          <div className={styles.disciplinesList}>
            {disciplines.map((discipline) => (
              <div key={discipline.id} className={styles.disciplineItem}>
                <div>
                  <h4>{discipline.title}</h4>
                  <p>Семестр: {discipline.semester}</p>
                </div>
                <button
                  onClick={() => handleDeleteDiscipline(discipline.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          {/* Требования к оценкам */}
          <div className={styles.sectionHeader}>
            <h2>Требования к оценкам</h2>
            <button
              onClick={() => {
                setRequirementsForm({
                  teacher_id: selectedTeacher.id.toString(),
                  discipline_id: "",
                  semester: "",
                  requirements_5: "",
                  requirements_4: "",
                  requirements_3: "",
                });
                setShowRequirementsForm(true);
              }}
              className={styles.addButton}
            >
              + Добавить требования
            </button>
          </div>

          {showRequirementsForm && (
            <form onSubmit={handleCreateRequirements} className={styles.form}>
              <h3>Создать требования к оценкам</h3>
              <select
                value={requirementsForm.discipline_id}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    discipline_id: e.target.value,
                  })
                }
                required
                className={styles.input}
              >
                <option value="">Выберите дисциплину</option>
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Семестр"
                value={requirementsForm.semester}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    semester: e.target.value,
                  })
                }
                required
                className={styles.input}
              />
              <textarea
                placeholder="Требования на 5"
                value={requirementsForm.requirements_5}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_5: e.target.value,
                  })
                }
                className={styles.textarea}
                rows="3"
              />
              <textarea
                placeholder="Требования на 4"
                value={requirementsForm.requirements_4}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_4: e.target.value,
                  })
                }
                className={styles.textarea}
                rows="3"
              />
              <textarea
                placeholder="Требования на 3"
                value={requirementsForm.requirements_3}
                onChange={(e) =>
                  setRequirementsForm({
                    ...requirementsForm,
                    requirements_3: e.target.value,
                  })
                }
                className={styles.textarea}
                rows="3"
              />
              <div className={styles.formButtons}>
                <button type="submit" className={styles.submitButton}>
                  Создать
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequirementsForm(false)}
                  className={styles.cancelButton}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* FAQ */}
      <div className={styles.section}>
        <h2>Все FAQ</h2>
        <div className={styles.faqsList}>
          {faqs.map((faq) => (
            <div key={faq.id} className={styles.faqItem}>
              <p className={styles.faqText}>{faq.text}</p>
              {faq.file_path && (
                <p className={styles.faqFile}>📎 Прикреплен файл</p>
              )}
              <div className={styles.faqMeta}>
                <span>
                  Преподаватель: {faq.teacher?.last_name}{" "}
                  {faq.teacher?.first_name}
                </span>
                <span>От: {faq.user?.name}</span>
                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
