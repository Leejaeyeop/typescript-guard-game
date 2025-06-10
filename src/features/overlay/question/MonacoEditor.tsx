"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { useRoundManager } from "@/contexts/RoundProvider";

import * as monacoEditor from "monaco-editor";

interface MonacoEditorProps {
  value: string | null;
  setIsEditorMounted: Dispatch<SetStateAction<boolean>>;
}

// Monaco 에디터 자체의 옵션
const EDITOR_OPTIONS: monacoEditor.editor.IStandaloneEditorConstructionOptions =
  {
    readOnly: true,
    minimap: { enabled: false },
    contextmenu: false,
    wordWrap: "on",
    cursorStyle: "line",
    mouseStyle: "default",
    selectionHighlight: false,
    selectionClipboard: false,
    dragAndDrop: false,
    glyphMargin: false,
    folding: false,
    lineNumbersMinChars: 2,
    hover: {
      enabled: false, // 👈 hover 비활성화
    },
  };

export default function MonacoEditor({
  value,
  setIsEditorMounted,
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null
  );
  const { setCorrectAnswer } = useRoundManager();

  const handleEditorMount: OnMount = (editor, monaco) => {
    setIsEditorMounted(true);
    editorRef.current = editor;
    // 에러가 발생 했을때만 호출 되는 이벤트
    // 에러는 코드상 체크하되, 마커 UI는 지움
    monaco.editor.onDidChangeMarkers(() => {
      const model = editor.getModel();
      if (!model) return;

      const markers = monaco.editor.getModelMarkers({ resource: model.uri });

      monaco.editor.setModelMarkers(model, "owner", []);

      // 코드 상에서는 에러 있는지 추적
      const hasSyntaxOrTypeError = markers.some(
        (marker) => marker.severity === monaco.MarkerSeverity.Error
      );
      setCorrectAnswer(!hasSyntaxOrTypeError);
    });
  };

  const handleEditorBeforeMount: BeforeMount = (monaco) => {
    // 컴파일러 옵션 설정
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      // important!
      allowNonTsExtensions: true,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true,
      noImplicitReturns: true,
    });

    // 진단 옵션 설정
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };
  useEffect(() => {
    if (!value) return;

    setCorrectAnswer(true);
    editorRef.current?.setValue(value);
    editorRef.current?.revealLine(1);
  }, [value, setCorrectAnswer]);

  return (
    <figure
      ref={containerRef}
      className="h-full w-full"
      role="group"
      aria-labelledby="editor-caption"
    >
      <figcaption id="editor-caption" className="sr-only">
        Typescript Question Code
      </figcaption>
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        beforeMount={handleEditorBeforeMount}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={EDITOR_OPTIONS}
      />
    </figure>
  );
}
