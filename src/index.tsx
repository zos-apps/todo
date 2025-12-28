import React, { useState, useEffect, useCallback } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoProps {
  onClose: () => void;
}

const STORAGE_KEY = 'zos-todos';

const TodoApp: React.FC<TodoProps> = ({ onClose }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
  }, [newTodo]);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, []);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="h-full flex flex-col bg-[#1c1c1e] text-white">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-2xl font-semibold text-red-500">Reminders</h1>
        <div className="flex gap-2 mt-3">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-colors
                ${filter === f ? 'bg-red-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            placeholder="Add a reminder..."
            className="flex-1 px-4 py-2 bg-white/10 rounded-lg text-sm placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
          <button
            onClick={addTodo}
            disabled={!newTodo.trim()}
            className="px-4 py-2 bg-red-500 hover:bg-red-400 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/40">
            <div className="text-4xl mb-2">✅</div>
            <p>{filter === 'all' ? 'No reminders yet' : `No ${filter} reminders`}</p>
          </div>
        ) : (
          <ul>
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 group"
              >
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${todo.completed ? 'bg-red-500 border-red-500' : 'border-white/30 hover:border-red-500'}
                  `}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 ${todo.completed ? 'line-through text-white/40' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {todos.length > 0 && (
        <div className="p-3 border-t border-white/10 flex items-center justify-between text-sm text-white/50">
          <span>{activeCount} remaining</span>
          {completedCount > 0 && (
            <button
              onClick={clearCompleted}
              className="hover:text-red-400 transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoApp;
