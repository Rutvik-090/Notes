// import { useEffect, useState } from "react";
// import Editor from "../component/Editor";
// import Sidebar from "../component/Sidebar";

// function Home() {
//   const [notes, setNotes] = useState([]);
//   const [activeNote, setActiveNote] = useState(null);

//   // Load notes from localStorage on mount
//   useEffect(() => {
//     const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
//     console.log("Loading notes from localStorage:", storedNotes); // Debug log
//     setNotes(storedNotes);
//     if (storedNotes.length > 0) setActiveNote(storedNotes[0]);
//   }, []);

//   // Update localStorage whenever notes change
//   useEffect(() => {
//     if (notes.length > 0) {
//       // Only save if there are notes
//       console.log("Saving notes to localStorage:", notes); // Debug log
//       localStorage.setItem("notes", JSON.stringify(notes));
//     }
//   }, [notes]);

//   // Create new note
//   const createNote = () => {
//     const newNote = {
//       id: Date.now(),
//       title: "Untitled",
//       content: "New note...",
//       pinned: false,
//     };
//     setNotes((prevNotes) => [newNote, ...prevNotes]);
//     setActiveNote(newNote);
//   };

//   // Save/update note
//   const saveNote = (updatedNote, isManualSave = false) => {
//     console.log("saveNote called with:", updatedNote); // Debug log
//     setNotes((prevNotes) =>
//       prevNotes
//         .map((n) => (n.id === updatedNote.id ? updatedNote : n))
//         .sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1))
//     );
//     setActiveNote(updatedNote);

//     if (isManualSave) {
//       alert("Note saved locally!");
//     }
//   };

//   return (
//     <div className="flex h-screen w-screen">
//       <Sidebar
//         notes={notes}
//         setNotes={setNotes}
//         onSelectNote={setActiveNote}
//         onCreateNote={createNote}
//         activeNote={activeNote}
//       />

//       <div className="flex-1 flex flex-col relative">
//         <div className="flex-1 pt-16 overflow-auto">
//           {activeNote ? (
//             <Editor note={activeNote} onSave={saveNote} />
//           ) : (
//             <div className="flex-1 flex mt-[20rem] items-center justify-center text-gray-400 text-xl font-semibold">
//               Select or create a note
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import { useEffect, useState } from "react";
import AIFeatures from "../component/AIFeature.jsx";
import Editor from "../component/Editor.jsx";
import Sidebar from "../component/Sidebar.jsx";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [showAIFeatures, setShowAIFeatures] = useState(true);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
    if (storedNotes.length > 0) setActiveNote(storedNotes[0]);
  }, []);

  const saveNote = (updatedNote, isManualSave = false) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setActiveNote(updatedNote);

    localStorage.setItem("notes", JSON.stringify(notes));
    if (isManualSave) alert("Note saved!");
  };

  const handleUpdateNote = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    setActiveNote(updatedNote);
  };

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: "Untitled",
      content: "New note...",
      pinned: false,
      tags: [],
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNote(newNote);
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar
        notes={notes}
        setNotes={setNotes}
        onSelectNote={setActiveNote}
        activeNote={activeNote}
        onCreateNote={createNote}
      />

      <div className="flex-1 flex flex-col relative">
        {activeNote && (
          <div className="flex-1 flex overflow-auto">
            <div className={`flex-1 ${showAIFeatures ? "pr-4" : ""}`}>
              <Editor note={activeNote} onSave={saveNote} />
            </div>

            {activeNote && showAIFeatures && (
              <div className="w-80 p-4 border-l border-gray-200 bg-gray-50 overflow-y-auto">
                <AIFeatures note={activeNote} onUpdateNote={handleUpdateNote} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
