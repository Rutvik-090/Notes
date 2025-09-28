import {
  AArrowDown,
  AArrowUp,
  Bold,
  Italic,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Underline,
} from "lucide-react";

export default function EditorToolbar({ exec }) {
  const btnClass =
    "p-2 rounded-lg hover:bg-white/20 cursor-pointer transition-transform hover:scale-110 text-gray-800";

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2
                 flex gap-3 items-center
                 px-6 py-3
                 bg-white/30 backdrop-blur-xl
                 border border-white/20
                 rounded-2xl shadow-lg
                 z-50"
    >
      <button onClick={() => exec("bold")} className={btnClass}>
        <Bold className="w-5 h-5" />
      </button>
      <button onClick={() => exec("italic")} className={btnClass}>
        <Italic className="w-5 h-5" />
      </button>
      <button onClick={() => exec("underline")} className={btnClass}>
        <Underline className="w-5 h-5" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300/50"></div>

      <button onClick={() => exec("justifyLeft")} className={btnClass}>
        <TextAlignStart className="w-5 h-5" />
      </button>
      <button onClick={() => exec("justifyCenter")} className={btnClass}>
        <TextAlignCenter className="w-5 h-5" />
      </button>
      <button onClick={() => exec("justifyRight")} className={btnClass}>
        <TextAlignEnd className="w-5 h-5" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300/50"></div>

      {/* Font Size Controls */}
      <button onClick={() => exec("fontSizeUp")} className={btnClass}>
        <AArrowUp className="w-5 h-5" />
      </button>
      <button onClick={() => exec("fontSizeDown")} className={btnClass}>
        <AArrowDown className="w-5 h-5" />
      </button>
    </div>
  );
}
