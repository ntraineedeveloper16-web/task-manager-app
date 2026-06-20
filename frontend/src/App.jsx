import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Filter,
  LayoutDashboard,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import api from "./api.js";
import taskflowHero from "./assets/taskflow-hero.jpg";

const columns = [
  {
    id: "todo",
    title: "To Do",
    tone: "border-slate-200",
    accent: "bg-slate-500",
    tint: "bg-slate-100 text-slate-700",
  },
  {
    id: "in-progress",
    title: "In Progress",
    tone: "border-pink-200",
    accent: "bg-pink-500",
    tint: "bg-pink-100 text-pink-700",
  },
  {
    id: "under-review",
    title: "Under Review",
    tone: "border-amber-200",
    accent: "bg-amber-500",
    tint: "bg-amber-100 text-amber-800",
  },
  {
    id: "completed",
    title: "Completed",
    tone: "border-emerald-200",
    accent: "bg-emerald-500",
    tint: "bg-emerald-100 text-emerald-700",
  },
];

const priorities = [
  { id: "low", label: "Low", className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" },
  { id: "medium", label: "Medium", className: "bg-amber-100 text-amber-800 ring-1 ring-amber-200" },
  { id: "high", label: "High", className: "bg-rose-100 text-rose-700 ring-1 ring-rose-200" },
];

const emptyTask = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("taskflow_user"));
  } catch {
    return null;
  }
}

function getApiErrorMessage(error, fallback) {
  const data = error.response?.data;
  const validationMessages = data?.errors?.map((item) => item.msg).filter(Boolean);

  if (validationMessages?.length) {
    return validationMessages.join(". ");
  }

  return data?.message || fallback;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("taskflow_token"));
  const [user, setUser] = useState(getStoredUser());
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "bhavana@gmail.com",
    password: "bhavana@123",
  });
  const [authError, setAuthError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, completed: 0 });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskModal, setTaskModal] = useState({ open: false, task: null });
  const [confirmTask, setConfirmTask] = useState(null);
  const [error, setError] = useState("");
  const displayName = user?.name || "Workspace User";

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = `${task.title} ${task.description || ""}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
      return matchesSearch && matchesPriority;
    });
  }, [tasks, search, priorityFilter]);

  async function fetchTasks() {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get("/tasks");
      setTasks(data.tasks || []);
      setStats(data.stats || { total: 0, pending: 0, underReview: 0, completed: 0 });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function handleAuth(event) {
    event.preventDefault();
    setAuthError("");
    setSaving(true);

    try {
      const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const { data } = await api.post(endpoint, payload);

      localStorage.setItem("taskflow_token", data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setAuthError(getApiErrorMessage(err, "Authentication failed"));
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setToken(null);
    setUser(null);
    setTasks([]);
  }

  async function saveTask(task) {
    setSaving(true);
    setError("");

    try {
      const payload = { ...task, dueDate: task.dueDate || null };

      if (task.id) {
        await api.put(`/tasks/${task.id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      setTaskModal({ open: false, task: null });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task");
    } finally {
      setSaving(false);
    }
  }

  async function moveTask(task, status) {
    await saveTask({ ...task, status });
  }

  async function deleteTask() {
    if (!confirmTask) return;
    setSaving(true);

    try {
      await api.delete(`/tasks/${confirmTask.id}`);
      setConfirmTask(null);
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete task");
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <AuthScreen
        mode={authMode}
        setMode={setAuthMode}
        form={authForm}
        setForm={setAuthForm}
        error={authError}
        saving={saving}
        onSubmit={handleAuth}
      />
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white shadow-premium">
                <ClipboardList size={22} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-normal">TaskFlow</h1>
                <p className="text-sm font-medium text-slate-500">Premium Task Manager</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-lg border border-slate-200 bg-white/70 px-4 py-2 text-right shadow-sm sm:block">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button className="icon-btn" onClick={logout} title="Logout" type="button">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-normal sm:text-4xl">
              Welcome back, <span className="text-pink-600">{displayName}</span>
            </h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Here is a quick snapshot of your active tasks workspace.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Total Tasks" value={stats.total} icon={<LayoutDashboard size={20} />} tone="bg-slate-950 text-white" />
          <Metric label="Pending Tasks" value={stats.pending} icon={<Clock3 size={20} />} tone="bg-pink-500 text-white" />
          <Metric label="Under Review" value={stats.underReview} icon={<ShieldCheck size={20} />} tone="bg-amber-500 text-white" />
          <Metric label="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} tone="bg-emerald-500 text-white" />
        </div>

        <div className="glass-panel mt-6 flex flex-col gap-3 rounded-lg px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <label className="control flex-1">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
                type="search"
              />
            </label>
            <label className="control sm:w-52">
              <Filter size={18} />
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="">All priorities</option>
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            className="primary-btn"
            type="button"
            onClick={() => setTaskModal({ open: true, task: null })}
          >
            <Plus size={18} />
            New Task
          </button>
        </div>

        {error && <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        <section className="mt-6 grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
              onEdit={(task) => setTaskModal({ open: true, task })}
              onDelete={setConfirmTask}
              onMove={moveTask}
            />
          ))}
        </section>

        {loading && (
          <div className="mt-10 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="animate-spin" size={18} />
            Loading workspace
          </div>
        )}
      </section>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          saving={saving}
          onClose={() => setTaskModal({ open: false, task: null })}
          onSave={saveTask}
        />
      )}

      {confirmTask && (
        <ConfirmDialog
          task={confirmTask}
          saving={saving}
          onCancel={() => setConfirmTask(null)}
          onConfirm={deleteTask}
        />
      )}
    </main>
  );
}

function AuthScreen({ mode, setMode, form, setForm, error, saving, onSubmit }) {
  const isLogin = mode === "login";

  return (
    <main className="grid min-h-screen px-4 py-8 text-slate-950 lg:grid-cols-[0.86fr_1.14fr] lg:px-0 lg:py-0">
      <section className="flex items-center justify-center px-4 py-10">
        <div className="glass-panel w-full max-w-md rounded-lg p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-slate-950 text-white shadow-premium">
              <ClipboardList size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TaskFlow</h1>
              <p className="text-sm font-medium text-slate-500">Secure workspace access</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            {!isLogin && (
              <label className="field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  minLength={2}
                  placeholder="Your name"
                  required
                />
              </label>
            )}
            <label className="field">
              <span>Email</span>
              <input
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="bhavana@gmail.com"
                required
                type="email"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                minLength={isLogin ? undefined : 6}
                placeholder="bhavana@123"
                required
                type="password"
              />
            </label>

            {error && <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">{error}</p>}

            <button className="primary-btn w-full justify-center" disabled={saving} type="submit">
              {saving ? <Loader2 className="animate-spin" size={18} /> : isLogin ? <ShieldCheck size={18} /> : <UserPlus size={18} />}
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <button
            className="mt-5 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            type="button"
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Need an account? Register" : "Already registered? Login"}
          </button>
        </div>
      </section>

      <section className="auth-art relative hidden items-center justify-center overflow-hidden px-10 text-white lg:flex">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src={taskflowHero}
        />
        <div className="absolute inset-0 bg-slate-950/62" />
        <div className="relative max-w-xl">
          <h2 className="text-5xl font-bold leading-tight">Plan, review, and complete work with clarity.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-200">
            A focused task board with secure access, priority tracking, and clean workspace metrics.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {columns.map((column) => (
              <div key={column.id} className="rounded-lg border border-white/15 bg-white/10 p-4 shadow-premium backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
                  <p className="font-bold">{column.title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-200">Organized task flow with secure access.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, icon, tone }) {
  return (
    <article className="glass-panel rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className={`grid h-10 w-10 place-items-center rounded-lg shadow-sm ${tone}`}>{icon}</span>
      </div>
      <p className="mt-4 text-4xl font-bold">{value}</p>
    </article>
  );
}

function KanbanColumn({ column, tasks, onEdit, onDelete, onMove }) {
  return (
    <div className={`kanban-column ${column.tone}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
          <h2 className="font-bold">{column.title}</h2>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${column.tint}`}>{tasks.length}</span>
      </div>
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
          />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 px-3 py-8 text-center text-sm font-medium text-slate-500">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, onEdit, onDelete, onMove }) {
  const priority = priorities.find((item) => item.id === task.priority) || priorities[1];

  return (
    <article className="task-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priority.className}`}>
            {priority.label}
          </span>
          <h3 className="mt-3 font-bold leading-snug">{task.title}</h3>
        </div>
        <div className="flex shrink-0 gap-1">
          <button className="icon-btn h-8 w-8" onClick={() => onEdit(task)} title="Edit task" type="button">
            <Pencil size={15} />
          </button>
          <button className="icon-btn h-8 w-8" onClick={() => onDelete(task)} title="Delete task" type="button">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {task.description && <p className="mt-3 text-sm leading-6 text-slate-600">{task.description}</p>}
      {task.dueDate && (
        <p className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
          <Calendar size={14} />
          {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <select
        className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none transition focus:border-slate-500 focus:ring-4 focus:ring-slate-200/70"
        value={task.status}
        onChange={(event) => onMove(task, event.target.value)}
      >
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            Move to {column.title}
          </option>
        ))}
      </select>
    </article>
  );
}

function TaskModal({ task, saving, onClose, onSave }) {
  const [form, setForm] = useState(task || emptyTask);

  function submit(event) {
    event.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-backdrop">
      <form className="modal-panel" onSubmit={submit}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{task ? "Edit Task" : "Create Task"}</h2>
          <button className="icon-btn" onClick={onClose} title="Close" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <label className="field">
            <span>Title</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              placeholder="Task title"
              required
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              value={form.description || ""}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              placeholder="Task details"
              rows="4"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="field">
              <span>Status</span>
              <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Priority</span>
              <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                {priorities.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Due Date</span>
              <input
                value={form.dueDate || ""}
                onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                type="date"
              />
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="secondary-btn" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="primary-btn" disabled={saving} type="submit">
            {saving && <Loader2 className="animate-spin" size={18} />}
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmDialog({ task, saving, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-md">
        <h2 className="text-xl font-semibold">Delete task?</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          This will permanently remove "{task.title}" from your workspace.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="secondary-btn" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="danger-btn" disabled={saving} onClick={onConfirm} type="button">
            {saving && <Loader2 className="animate-spin" size={18} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
