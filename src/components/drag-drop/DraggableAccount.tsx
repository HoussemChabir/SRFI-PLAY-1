import { GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

interface DraggableAccountProps {
  account: Account;
}

const getCategoryColor = (classification: string) => {
  if (classification.includes("Asset")) return "bg-green-100 border-green-500 text-green-800";
  if (classification.includes("Liability")) return "bg-red-100 border-red-500 text-red-800";
  if (classification.includes("Equity")) return "bg-orange-100 border-orange-500 text-orange-800";
  if (classification.includes("Revenue")) return "bg-yellow-100 border-yellow-500 text-yellow-800";
  if (classification.includes("Expense")) return "bg-blue-100 border-blue-500 text-blue-800";
  return "bg-gray-100 border-gray-500 text-gray-800";
};

const DraggableAccount = ({ account }: DraggableAccountProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("account", JSON.stringify(account));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card
      draggable
      onDragStart={handleDragStart}
      className={`p-3 cursor-move hover:shadow-md transition-all border-l-4 ${getCategoryColor(
        account.classification
      )}`}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{account.accountTitle}</p>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {account.normalBalance}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DraggableAccount;
