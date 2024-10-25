import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Template {
  name: string;
  content: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (content: string) => void;
  currentTemplate: string;
}

export function TemplateSelector({ onTemplateSelect, currentTemplate }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<{ builtIn: string; custom: Template[] }>({
    builtIn: '',
    custom: []
  });
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const saveTemplate = async () => {
    if (!newTemplateName) return;

    try {
      await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTemplateName,
          content: currentTemplate
        }),
      });

      setNewTemplateName('');
      fetchTemplates();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Select onValueChange={(value) => {
        if (value === 'built-in') {
          onTemplateSelect(templates.builtIn);
        } else {
          const template = templates.custom.find(t => t.name === value);
          if (template) {
            onTemplateSelect(template.content);
          }
        }
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="built-in">Built-in Template</SelectItem>
          {templates.custom.map((template) => (
            <SelectItem key={template.name} value={template.name}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Input
          placeholder="New template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
        />
        <Button onClick={saveTemplate} disabled={!newTemplateName}>
          Save Template
        </Button>
      </div>
    </div>
  );
}
