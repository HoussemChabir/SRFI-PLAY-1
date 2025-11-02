import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

interface DropZoneProps {
  id: string;
  label: string;
  accounts: Account[];
  onDrop: (account: Account) => void;
  onRemove: (account: Account) => void;
}

const DropZone = ({ id, label, accounts, onDrop, onRemove }: DropZoneProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const accountData = e.dataTransfer.getData("account");
    if (accountData) {
      const account = JSON.parse(accountData);
      onDrop(account);
    }
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition-all min-h-[120px] ${
        isDragOver ? "border-primary border-2 bg-primary/5 shadow-lg" : "border-dashed"
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Drop accounts here
          </p>
        ) : (
          <div className="space-y-2">
            {accounts.map((account) => (
              <div
                key={account.accountTitle}
                className="flex items-center justify-between p-2 bg-primary/10 rounded-md border border-primary/20 animate-glow"
              >
                <span className="text-sm font-medium">{account.accountTitle}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(account)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DropZone;
