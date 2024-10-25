"use client";

import Editor from "@monaco-editor/react";

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
}

export function YamlEditor({ value, onChange, title }: YamlEditorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Editor
        height="400px"
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || "")}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
}