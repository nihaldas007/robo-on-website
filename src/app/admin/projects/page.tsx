"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Zap, Code2, Loader2, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc } from "firebase/firestore";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  status: string;
  team: number;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("IoT");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState("");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const docRef = doc(db, "projects", editingId);
        await updateDoc(docRef, {
          title,
          category,
          description: desc,
          image,
        });
        setProjects(projects.map(p => p.id === editingId ? { ...p, title, category, description: desc, image } : p));
      } else {
        const docRef = await addDoc(collection(db, "projects"), {
          title,
          category,
          description: desc,
          image,
          status: "Active",
          team: 1,
          createdAt: serverTimestamp()
        });
        setProjects([{ id: docRef.id, title, category, description: desc, image, status: "Active", team: 1 }, ...projects]);
      }
      setIsAdding(false);
      setEditingId(null);
      setTitle("");
      setDesc("");
      setImage("");
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project.");
    }
  };

  const handleEdit = (project: Project) => {
    setTitle(project.title);
    setCategory(project.category);
    setDesc(project.description);
    setImage(project.image || "");
    setEditingId(project.id);
    setIsAdding(true);
  };

  const openAddForm = () => {
    setTitle("");
    setCategory("IoT");
    setDesc("");
    setImage("");
    setEditingId(null);
    setIsAdding(!isAdding);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Showcase Management</h1>
          <p className="text-gray-400 text-sm">Add and organize your engineering portfolio items.</p>
        </div>
        
        <button 
          onClick={openAddForm}
          className="bg-primary text-black font-bold px-6 py-2.5 rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)]"
        >
          <Plus size={18} /> {isAdding && !editingId ? "Cancel" : "Add Project"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProject} className="mb-8 p-6 glass-card rounded-3xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Project Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g. Smart Hexapod" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                <option>IoT</option><option>Robotics</option><option>Hardware</option><option>Software</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URL</label>
              <input value={image} onChange={e => setImage(e.target.value)} type="url" placeholder="https://unsplash.com/..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
              <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the project..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none min-h-[100px]" />
            </div>
          </div>
          <button type="submit" className="bg-primary text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-all shadow-lg shadow-primary/20">
            Save Project
          </button>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-3xl">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
          <p>No projects found in your portfolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {projects.map((project) => (
            <div key={project.id} className="glass-card rounded-2xl border border-white/5 relative group overflow-hidden flex flex-col">
              <div className="h-40 bg-gray-900 relative flex-shrink-0">
                <img src={project.image || "https://www.transparenttextures.com/patterns/cubes.png"} alt={project.title} className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(project)} className="p-1.5 text-gray-400 hover:text-white bg-black/40 hover:bg-white/10 rounded-md transition-colors backdrop-blur-md">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-1.5 text-gray-400 hover:text-red-400 bg-black/40 hover:bg-red-400/10 rounded-md transition-colors backdrop-blur-md">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex flex-shrink-0 items-center justify-center text-primary border border-primary/20">
                    {project.category === "Robotics" ? <Zap size={20} /> : <Code2 size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                    <p className="text-[10px] text-gray-500 font-mono tracking-widest">{project.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-grow">{project.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 pt-4 border-t border-white/5">
                  <span 
                    onClick={async () => {
                      const newStatus = project.status === 'Completed' ? 'Active' : 'Completed';
                      try {
                        await updateDoc(doc(db, "projects", project.id), { status: newStatus });
                        setProjects(projects.map(p => p.id === project.id ? { ...p, status: newStatus } : p));
                      } catch (err) {
                        console.error("Error updating status:", err);
                      }
                    }}
                    className={`px-2 py-0.5 rounded-full font-bold cursor-pointer transition-colors ${project.status === 'Completed' ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'}`}>
                    {project.status || 'Active'}
                  </span>
                  <span>{project.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
