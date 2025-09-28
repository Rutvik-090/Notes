import NoteList from "./Notelist.jsx";

function Sidebar({ notes, setNotes, onSelectNote, activeNote, onCreateNote }) {
  return (
    <div className="w-64 h-screen border-r-2 border-black flex flex-col p-4 items-center">
      <h1 className="font-semibold text-2xl mb-4">My Notes</h1>

      {/* Optional top "New Note" button */}
      <button
        onClick={onCreateNote}
        className="bg-blue-500 w-full h-10 rounded text-white px-2 py-1 mb-4 flex items-center justify-center hover:bg-blue-600 transition"
      >
        + New Note
      </button>

      {/* Notes list */}
      <NoteList
        notes={notes}
        setNotes={setNotes}
        onSelectNote={onSelectNote}
        activeNote={activeNote}
        onCreateNote={onCreateNote}
      />
    </div>
  );
}

export default Sidebar;
