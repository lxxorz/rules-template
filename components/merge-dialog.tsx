"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface MergeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflictingFields: string[];
  mergeStrategy: Record<string, "keep" | "replace">;
  setMergeStrategy: (strategy: Record<string, "keep" | "replace">) => void;
  onMerge: () => void;
}

export function MergeDialog({
  open,
  onOpenChange,
  conflictingFields,
  mergeStrategy,
  setMergeStrategy,
  onMerge,
}: MergeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolve Conflicts</DialogTitle>
          <DialogDescription>
            Choose how to handle conflicting fields
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {conflictingFields.map((field) => (
            <div key={field} className="space-y-2">
              <Label>Field: {field}</Label>
              <RadioGroup
                onValueChange={(value) =>
                  setMergeStrategy((prev) => ({
                    ...prev,
                    [field]: value as "keep" | "replace",
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="keep" id={`${field}-keep`} />
                  <Label htmlFor={`${field}-keep`}>Keep existing value</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id={`${field}-replace`} />
                  <Label htmlFor={`${field}-replace`}>Use template value</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            onClick={onMerge}
            disabled={
              Object.keys(mergeStrategy).length !== conflictingFields.length
            }
          >
            Apply Merge Strategy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}