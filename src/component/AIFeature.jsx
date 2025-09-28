// import { useEffect, useState } from "react";
// import AIFeatures from "../component/AIFeatures"; // Import your AI component
// import Editor from "../component/Editor";
// import Sidebar from "../component/Sidebar";

// function Home() {
//   const [notes, setNotes] = useState([]);
//   const [activeNote, setActiveNote] = useState(null);
//   const [showAIFeatures, setShowAIFeatures] = useState(true); // Toggle AI panel

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
//       tags: [], // Initialize tags array
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

//   // Handle AI feature updates (for tags and other AI-generated content)
//   const handleUpdateNote = (updatedNote) => {
//     setNotes((prevNotes) =>
//       prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
//     );
//     setActiveNote(updatedNote);

//     // Save to localStorage immediately when AI features update the note
//     localStorage.setItem(
//       "notes",
//       JSON.stringify(
//         notes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
//       )
//     );
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
//         {/* AI Features Toggle Button */}
//         {activeNote && (
//           <div className="absolute top-4 right-4 z-10">
//             <button
//               onClick={() => setShowAIFeatures(!showAIFeatures)}
//               className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg transition-colors duration-200 flex items-center gap-2"
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 10V3L4 14h7v7l9-11h-7z"
//                 />
//               </svg>
//               {showAIFeatures ? "Hide AI" : "Show AI"}
//             </button>
//           </div>
//         )}

//         <div className="flex-1 pt-16 overflow-auto flex">
//           {/* Main Editor Area */}
//           <div
//             className={`${
//               showAIFeatures && activeNote ? "flex-1 pr-4" : "flex-1"
//             }`}
//           >
//             {activeNote ? (
//               <Editor note={activeNote} onSave={saveNote} />
//             ) : (
//               <div className="flex-1 flex mt-[20rem] items-center justify-center text-gray-400 text-xl font-semibold">
//                 Select or create a note
//               </div>
//             )}
//           </div>

//           {/* AI Features Panel */}
//           {activeNote && showAIFeatures && (
//             <div className="w-80 p-4 border-l border-gray-200 bg-gray-50 overflow-y-auto">
//               <AIFeatures note={activeNote} onUpdateNote={handleUpdateNote} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;

import { useState } from "react";

export default function AIFeatures({ note, onUpdateNote }) {
  const [loading, setLoading] = useState(false);

  const generateAISummary = async () => {
    setLoading(true);

    // Replace with HuggingFace / OpenAI API call
    const dummySummary = note.content.slice(0, 120) + "..."; // placeholder
    const dummyTags = ["example", "ai", "summary"];

    const updatedNote = { ...note, aiSummary: dummySummary, tags: dummyTags };
    onUpdateNote(updatedNote);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={generateAISummary}
        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm"
      >
        {loading ? "Generating..." : "Generate AI Summary & Tags"}
      </button>

      {note.aiSummary && (
        <div>
          <h4 className="text-sm font-semibold mb-1">AI Summary Preview:</h4>
          <p className="text-gray-700 text-sm">{note.aiSummary}</p>
          {note.tags && (
            <div className="flex gap-2 flex-wrap mt-1">
              {note.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
