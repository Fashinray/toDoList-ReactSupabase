import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import TodoForm from '../public/components/TodoForm';
import TodoList from '../public/components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);

  // ✅ Fetch tasks on mount
  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setTodos(data);
      else console.error("Fetch error:", error);
    };

    fetchTodos();
  }, []); // empty array ensures it runs once on mount

  // ✅ Add task
  const addTodo = async (task) => {
    const { data, error } = await supabase
      .from('todos')
      .insert([{ task, completed: false }])
      .select(); // get the inserted row

    if (error) {
      console.error("Add error:", error);
      return;
    }

    setTodos(prev => [data[0], ...prev]); // Add new task to top
  };

  // ✅ Delete task
  const deleteTodo = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (!error) setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // ✅ Update task (toggle or edit)
  const updateTodo = async (id, updatedFields) => {
    const { error } = await supabase
      .from('todos')
      .update(updatedFields)
      .eq('id', id);

    if (!error) {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, ...updatedFields } : todo
        )
      );
    } else {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-600 to-emerald-400">
      <div className="bg-white shadow-lg rounded-3xl p-8">
        <h1 className="text-center font-bold text-3xl mb-6">ToDo App</h1>
        <TodoForm onAdd={addTodo} />
        <TodoList
          todos={todos}
          onDelete={deleteTodo}
          onToggle={updateTodo}
          onEdit={updateTodo}
        />
      </div>
    </div>
  );
}

export default App;
