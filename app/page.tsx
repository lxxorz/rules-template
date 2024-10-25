"use client";

import { useState } from "react";
import { FileText, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { load as yamlLoad, dump as yamlDump } from "js-yaml";
import { YamlEditor } from "@/components/yaml-editor";
import { MergeDialog } from "@/components/merge-dialog";
import { TemplateSelector } from "@/components/template-selector";

export default function Home() {
  const [subscriptionUrl, setSubscriptionUrl] = useState("");
  const [yamlContent, setYamlContent] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [conflictingFields, setConflictingFields] = useState<string[]>([]);
  const [mergeStrategy, setMergeStrategy] = useState<Record<string, "keep" | "replace">>({});
  const { toast } = useToast();

  const downloadYaml = async () => {
    try {
      const response = await fetch(`/api/sub`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: subscriptionUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to download YAML");
      }

      const data = await response.text();
      setYamlContent(data);

      toast({
        title: "Success",
        description: "YAML file downloaded successfully",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to download YAML file",
        variant: "destructive",
      });
    }
  };

  const handleMerge = () => {
    try {
      const existingYaml = yamlLoad(yamlContent) as Record<string, any>;
      const templateYaml = yamlLoad(templateContent) as Record<string, any>;

      const conflicts = Object.keys(templateYaml).filter(
        (key) => key in existingYaml
      );

      if (conflicts.length > 0 && Object.keys(mergeStrategy).length === 0) {
        setConflictingFields(conflicts);
        setShowMergeDialog(true);
        return;
      }

      const mergedYaml = { ...existingYaml };
      Object.keys(templateYaml).forEach((key) => {
        if (key in mergeStrategy) {
          if (mergeStrategy[key] === "replace") {
            mergedYaml[key] = templateYaml[key];
          }
        } else {
          mergedYaml[key] = templateYaml[key];
        }
      });

      setYamlContent(yamlDump(mergedYaml));
      setShowMergeDialog(false);
      setMergeStrategy({});
      toast({
        title: "Success",
        description: "Templates merged successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to merge templates",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-rules.yaml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8">
        Subscription Rule Template Manager
      </h1>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Enter subscription URL"
              value={subscriptionUrl}
              onChange={(e) => setSubscriptionUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={downloadYaml}>
              <Download className="mr-2 h-4 w-4" />
              Download YAML
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <YamlEditor
              title="Current YAML"
              value={yamlContent}
              onChange={setYamlContent}
            />
            <div className="space-y-4">
              <TemplateSelector
                onTemplateSelect={setTemplateContent}
                currentTemplate={templateContent}
              />
              <YamlEditor
                title="Template Editor"
                value={templateContent}
                onChange={setTemplateContent}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={handleMerge} disabled={!yamlContent || !templateContent}>
              <Upload className="mr-2 h-4 w-4" />
              Merge Template
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!yamlContent}
              variant="secondary"
            >
              <FileText className="mr-2 h-4 w-4" />
              Save Merged YAML
            </Button>
          </div>
        </div>
      </Card>

      <MergeDialog
        open={showMergeDialog}
        onOpenChange={setShowMergeDialog}
        conflictingFields={conflictingFields}
        mergeStrategy={mergeStrategy}
        setMergeStrategy={setMergeStrategy}
        onMerge={handleMerge}
      />
    </div>
  );
}
