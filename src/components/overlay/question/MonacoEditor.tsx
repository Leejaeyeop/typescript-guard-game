"use client";
import React, { useEffect, useRef } from "react";
import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import { useRoundManager } from "@/app/(pixijs)/hooks/use-round-manager";

import * as monacoEditor from "monaco-editor";

interface MonacoEditorProps {
  value: string | null;
}

export default function MonacoEditor({ value }: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null
  );
  const { setCorrectAnswer } = useRoundManager();

  const handleEditorMount: OnMount = (editor, monaco) => {
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
  }, [value]);

  // useEffect(() => {
  //   if (!containerRef.current) return;
  //   const resizeObserver = new ResizeObserver(() => {
  //     if (editorRef.current) {
  //       editorRef.current.layout();
  //     }
  //   });

  //   resizeObserver.observe(containerRef.current);

  //   return () => resizeObserver.disconnect();
  // }, [containerRef]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        beforeMount={handleEditorBeforeMount}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          contextmenu: false, // 우클릭 메뉴 비활성화
          // width 값을 고정시킨다.
          wordWrap: "on",
          cursorStyle: "line",
          mouseStyle: "default", // 커서 모양 단순화
          selectionHighlight: false,
          selectionClipboard: false,
          dragAndDrop: false, // ⛔ 드래그 금지

          // lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          // lineDecorationsWidth: 0,
          lineNumbersMinChars: 2,
        }}
      />
    </div>
  );
}
