import { Pin, Search, Trash2 } from "lucide-react";
import { useState } from "react";

export default function NoteList({
  notes,
  setNotes,
  onSelectNote,
  activeNote,
  onCreateNote,
}) {
  const [search, setSearch] = useState("");

  // Filter notes by search
  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(search.toLowerCase()))
  );

  const deleteNote = (id) => {
    if (window.confirm("Delete this note?")) {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      if (activeNote?.id === id) onSelectNote(null);
    }
  };

  const togglePin = (id) => {
    const updatedNotes = notes
      .map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="flex h-screen flex-col gap-3 overflow-y-auto p-3 relative">
      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {filteredNotes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note)}
          className={`group relative p-4 rounded-xl cursor-pointer transition-all
            ${
              activeNote?.id === note.id
                ? "bg-gradient-to-r from-blue-100 to-blue-200 shadow-md border border-blue-300"
                : "bg-white shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5"
            }`}
        >
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-gray-900 truncate pr-16">
              {note.title || "Untitled"}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note.id);
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition"
                title={note.pinned ? "Unpin note" : "Pin note"}
              >
                <Pin
                  className={`w-5 h-5 ${
                    note.pinned
                      ? "text-yellow-500 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="p-1 rounded-full hover:bg-red-100 transition"
                title="Delete note"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {note.content ? note.content.replace(/<[^>]+>/g, "") : "Empty note"}
          </p>
        </div>
      ))}
    </div>
  );
}
