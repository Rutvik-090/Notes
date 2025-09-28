import { useCallback, useEffect, useRef, useState } from "react";
import { highlightGlossary } from "../utils/glossary";
import { checkGrammar, highlightGrammarErrors } from "../utils/grammar";
import Toolbar from "./Toolbar";

export default function Editor({ note, onSave }) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(note.title);
  const [pinned, setPinned] = useState(note.pinned);
  const [currentFontSize, setCurrentFontSize] = useState(16);
  const [mistakes, setMistakes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastText, setLastText] = useState(note.content || "");

  const FONT_SIZES = [14, 16, 18, 20, 24, 28];

  // --- Debounce utility ---
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // --- Save/restore cursor helpers ---
  const saveSelection = (containerEl) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return null;
    const range = sel.getRangeAt(0).cloneRange();
    range.selectNodeContents(containerEl);
    range.setEnd(
      sel.getRangeAt(0).startContainer,
      sel.getRangeAt(0).startOffset
    );
    return {
      start: range.toString().length,
      end: range.toString().length + sel.toString().length,
    };
  };

  const restoreSelection = (containerEl, savedSel) => {
    if (!savedSel) return;
    const walker = document.createTreeWalker(
      containerEl,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    let currentPos = 0,
      node;
    while ((node = walker.nextNode())) {
      const nodeLength = node.textContent.length;
      if (currentPos + nodeLength >= savedSel.start) {
        const range = document.createRange();
        const startPos = Math.max(0, savedSel.start - currentPos);
        const endPos = Math.min(nodeLength, savedSel.end - currentPos);
        range.setStart(node, startPos);
        range.setEnd(node, endPos);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        break;
      }
      currentPos += nodeLength;
    }
  };

  // --- Load note ---
  useEffect(() => {
    setTitle(note.title);
    setPinned(note.pinned);
    setCurrentFontSize(16);
    setLastText(note.content || "");
    if (editorRef.current) {
      editorRef.current.innerHTML = highlightGlossary(note.content || "");
    }
  }, [note]);

  // --- Save note ---
  const saveNote = () => {
    const plainText = editorRef.current?.innerText || "";
    onSave({ ...note, title, content: plainText, pinned });
    setLastText(plainText);
    alert("Note saved!");
  };

  // --- Toolbar commands ---
  const exec = (command) => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (command === "fontSizeUp" || command === "fontSizeDown") {
      const index = FONT_SIZES.indexOf(currentFontSize);
      let newSize = currentFontSize;
      if (command === "fontSizeUp" && index < FONT_SIZES.length - 1)
        newSize = FONT_SIZES[index + 1];
      if (command === "fontSizeDown" && index > 0)
        newSize = FONT_SIZES[index - 1];
      if (newSize !== currentFontSize) {
        const sel = window.getSelection();
        if (sel.rangeCount) {
          document.execCommand("fontSize", false, "7");
          Array.from(editorRef.current.getElementsByTagName("font")).forEach(
            (f) => {
              if (f.size === "7") {
                f.removeAttribute("size");
                f.style.fontSize = `${newSize}px`;
              }
            }
          );
        }
        setCurrentFontSize(newSize);
      }
    } else if (command === "togglePin") {
      setPinned((prev) => !prev);
    } else {
      document.execCommand(command, false, null);
    }
  };

  // --- Grammar check ---
  const debouncedGrammarCheck = useCallback(
    debounce(async (text, savedSel) => {
      if (isProcessing || text === lastText) return;
      setIsProcessing(true);
      try {
        const grammarMistakes = await checkGrammar(text);
        setMistakes(grammarMistakes);

        if (editorRef.current) {
          let highlighted = highlightGlossary(text);
          highlighted = highlightGrammarErrors(highlighted, grammarMistakes);
          if (editorRef.current.innerHTML !== highlighted) {
            editorRef.current.innerHTML = highlighted;
            restoreSelection(editorRef.current, savedSel);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
        setLastText(text);
      }
    }, 1500),
    [isProcessing, lastText]
  );

  // --- Input handler ---
  const onInput = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    setLastText(text);

    const savedSel = saveSelection(editorRef.current);
    debouncedGrammarCheck(text, savedSel);
  };

  // --- Paste handling ---
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    editorRef.current.dispatchEvent(new Event("input", { bubbles: true }));
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("paste", handlePaste);
      return () => editor.removeEventListener("paste", handlePaste);
    }
  }, [handlePaste]);

  // --- Keyboard shortcuts ---
  const handleKeyDown = useCallback(
    (e) => {
      if (isProcessing) return;
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        exec("bold");
      }
      if (e.ctrlKey && e.key === "i") {
        e.preventDefault();
        exec("italic");
      }
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        exec("underline");
      }
    },
    [isProcessing]
  );

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
      return () => editor.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  return (
    <div className="flex-1 flex flex-col p-4">
      <Toolbar exec={exec} />
      <div className="flex items-center mb-2 mt-20 gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-b border-gray-400 flex-1 p-1 text-lg font-semibold outline-none"
          placeholder="Note title"
        />
        {pinned && <span className="text-yellow-500">📌</span>}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={onInput}
        className="flex-1 p-2 border border-gray-300 rounded outline-none resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        style={{
          minHeight: "550px",
          maxHeight: "80vh",
          fontSize: "16px",
          marginTop: "1rem",
          whiteSpace: "pre-wrap",
        }}
        spellCheck={false}
      />

      {isProcessing && (
        <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
          Checking grammar...
        </div>
      )}

      {mistakes.length > 0 && !isProcessing && (
        <div className="text-sm text-red-500 mt-2">
          {mistakes.length} grammar issue{mistakes.length !== 1 ? "s" : ""}{" "}
          found
        </div>
      )}

      <div className="flex justify-center items-center mt-4">
        <button
          onClick={saveNote}
          className="bg-green-500 w-[30rem] text-white p-2 m-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
