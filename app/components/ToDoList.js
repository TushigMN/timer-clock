'use client';
import { useState, useEffect } from "react";

export default function ToDoList() {
  const [list, setList] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');

  useEffect(() => {
    const savedList = localStorage.getItem("my-todo-list");
    if (savedList) {
      setList(JSON.parse(savedList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("my-todo-list", JSON.stringify(list));
  }, [list]);

  const addElement = () => {
    if (input.trim() === '') return alert("You must write something!");
    setList([...list, { id: Date.now(), text: input, checked: false }]);
    setInput('');
  };

  const deleteElement = (id) => {
    if (confirm("Delete this task?")) {
      setList(list.filter(item => item.id !== id));
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditInput(item.text);
  };

  const saveEdit = (id) => {
    setList(list.map(item => item.id === id ? { ...item, text: editInput } : item));
    setEditingId(null);
  };

  const toggleCheck = (id) => {
    setList(list.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="w-full max-w-md bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 mt-6 mb-10">
      <h2 className="text-xl font-bold mb-4 text-blue-400">To-Do List</h2>
      
      <div className="flex gap-2 mb-6">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addElement()}
          className="bg-slate-800 text-white p-2 rounded-lg flex-grow border border-slate-700 focus:outline-none focus:border-blue-500 transition-all"
          placeholder="What's next?"
        />
        <button 
          onClick={addElement} 
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-bold transition-colors"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {list.map((item) => (
          <li key={item.id} className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between gap-4 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="flex items-center gap-3 flex-grow overflow-hidden">
              <input 
                type="checkbox" 
                checked={item.checked} 
                onChange={() => toggleCheck(item.id)}
                className="w-5 h-5 min-w-[20px] cursor-pointer accent-blue-500"
              />
              
              {editingId === item.id ? (
                <input 
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
                  className="bg-slate-800 text-white px-2 py-1 rounded w-full outline-none border border-blue-500"
                  autoFocus
                />
              ) : (
                <span className={`truncate ${item.checked ? "line-through text-slate-500" : "text-slate-200"}`}>
                  {item.text}
                </span>
              )}
            </div>

            <div className="flex gap-1 shrink-0 font-mono text-sm">
              {editingId === item.id ? (
                <>
                  <button onClick={() => saveEdit(item.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-500 transition">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(item)} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50">Edit</button>
                  <button onClick={() => deleteElement(item.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50">Delete</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      {list.length === 0 && (
        <p className="text-center text-slate-600 text-sm mt-4 italic">No tasks yet. Add one above!</p>
      )}
    </div>
  );
}