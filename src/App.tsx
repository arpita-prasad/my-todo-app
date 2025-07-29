import { useState, useEffect } from 'react';
import { databases, ID } from  './appwrite';
import { FaTrash, FaCheckCircle, FaCircle } from 'react-icons/fa';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'complete' | 'pending';

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;     
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await databases.listDocuments(DB_ID, COLLECTION_ID);
        setTasks(
          res.documents.map((doc: any) => ({
            id: doc.$id,
            text: doc.text,
            completed: doc.completed,
          }))
        );
      } catch (e) {
        console.log(e)
        alert('Failed to fetch tasks: ' + (e instanceof Error ? e.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (taskText.trim() === '') return;
    try {
      const doc = await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
        text: taskText.trim(),
        completed: false,
      });
      setTasks([{ id: doc.$id, text: doc.text, completed: doc.completed }, ...tasks]);
      setTaskText('');
    } catch (e) {
      alert('Failed to add task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_ID, id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (e) {
      alert('Failed to delete task');
    }
  };

  const toggleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    try {
      const updated = await databases.updateDocument(DB_ID, COLLECTION_ID, id, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => (t.id === id ? { ...t, completed: updated.completed } : t)));
    } catch (e) {
      alert('Failed to update task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'complete') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-100 to-blue-300 transition-all">
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl w-[340px] sm:w-[420px] border border-white/40
        h-[500px] flex flex-col"
      >
        <h1 className="text-3xl font-bold text-center text-purple-600 mb-6 drop-shadow-sm tracking-tight mt-8">My To-Do List</h1>

        <div className="flex items-center gap-3 mb-6 px-4">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 border-none rounded-full px-6 py-4 outline-none text-base text-gray-700 placeholder:text-gray-400 bg-white/70 shadow-inner focus:ring-2 focus:ring-purple-300 transition"
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <button
            onClick={addTask}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-3 rounded-full text-base font-semibold shadow-lg hover:scale-105 hover:from-purple-600 hover:to-indigo-600 active:scale-95 transition"
          >
            Add
          </button>
        </div>

        <div className="flex-1 mb-6 space-y-3 overflow-y-auto min-h-[150px] px-2">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center">Loading...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-sm text-center">No tasks yet. Add one!</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl shadow-sm bg-white/80 hover:bg-purple-50 transition group"
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mr-3 focus:outline-none"
                  title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed ? (
                    <FaCheckCircle className="text-purple-500 text-xl animate-pulse" />
                  ) : (
                    <FaCircle className="text-gray-300 text-xl" />
                  )}
                </button>

                <span
                  onClick={() => toggleComplete(task.id)}
                  className={`flex-1 cursor-pointer font-medium select-none transition ${
                    task.completed ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-purple-600'
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-4 border-none text-red-400 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition"
                  title="Delete"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-center gap-x-3 text-sm mt-auto mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === 'all' ? 'bg-purple-100 text-purple-700 shadow' : 'text-purple-500 hover:bg-purple-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('complete')}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === 'complete' ? 'bg-purple-100 text-purple-700 shadow' : 'text-purple-500 hover:bg-purple-50'
            }`}
          >
            Complete
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-5 py-2 rounded-full font-semibold transition ${
              filter === 'pending' ? 'bg-purple-100 text-purple-700 shadow' : 'text-purple-500 hover:bg-purple-50'
            }`}
          >
            Pending
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
