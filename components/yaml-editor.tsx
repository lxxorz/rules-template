"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  title: string;
}

export function YamlEditor({ value, onChange, title }: YamlEditorProps) {
  const { theme } = useTheme();
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Editor
        height="400px"
        defaultLanguage="yaml"
        value={value}
        onChange={(value) => onChange(value || "")}
        theme   ={theme === "dark" ? "vs-dark" : "vs-light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
}
