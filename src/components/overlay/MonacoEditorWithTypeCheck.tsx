"use client";
import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";

export default function MonacoEditorWithSilentErrors() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null
  );
  const [hasError, setHasError] = useState(false);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // 에러는 코드상 체크하되, 마커 UI는 지움
    monaco.editor.onDidChangeMarkers(() => {
      const model = editor.getModel();
      if (!model) return;

      const markers = monaco.editor.getModelMarkers({ resource: model.uri });

      // 마커를 수동 제거 (UI 상 안 보이게 함)
      monaco.editor.setModelMarkers(model, "owner", []);

      // 코드 상에서는 에러 있는지 추적
      const hasSyntaxOrTypeError = markers.some(
        (marker) => marker.severity === monaco.MarkerSeverity.Error
      );
      console.log(hasSyntaxOrTypeError);
      setHasError(hasSyntaxOrTypeError);
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, [containerRef]);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Editor
        height="100%"
        width="100%"
        defaultLanguage="typescript"
        defaultValue={`const a: string = 123;`}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          readOnly: true,
          glyphMargin: false,
          lineNumbers: "off",
          minimap: { enabled: false },
          contextmenu: false, // 우클릭 메뉴 비활성화
        }}
      />
      {/* <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        코드 상태: {hasError ? "❌ 에러 있음" : "✅ 유효한 코드"}
      </div> */}
    </div>
  );
}
