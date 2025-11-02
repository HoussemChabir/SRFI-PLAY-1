import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AccountPool from "@/components/drag-drop/AccountPool";
import DropZone from "@/components/drag-drop/DropZone";
import SolutionsOverlay from "@/components/drag-drop/SolutionsOverlay";
import chartData from "@/data/chartOfAccounts.json";

type StatementType = "balance-sheet" | "income-statement" | "cash-flow";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

const DragDrop = () => {
  const navigate = useNavigate();
  const [activeStatement, setActiveStatement] = useState<StatementType>("balance-sheet");
  const [placedAccounts, setPlacedAccounts] = useState<{ [key: string]: Account[] }>({});
  const [showSolutions, setShowSolutions] = useState(false);

  const accounts: Account[] = chartData.chartOfAccounts;

  const balanceSheetZones = [
    { id: "current-assets", label: "Current Assets", validTypes: ["Current Asset"] },
    { id: "non-current-assets", label: "Non-Current Assets", validTypes: ["Plant Asset", "Intangible Asset", "Non-Current Asset"] },
    { id: "current-liabilities", label: "Current Liabilities", validTypes: ["Current Liability"] },
    { id: "non-current-liabilities", label: "Non-Current Liabilities", validTypes: ["Non-Current Liability"] },
    { id: "equity", label: "Equity", validTypes: ["Equity"] },
  ];

  const incomeStatementZones = [
    { id: "revenues", label: "Revenues", validTypes: ["Revenue"] },
    { id: "cogs", label: "Cost of Goods Sold", validTypes: ["Cost of Goods Sold"] },
    { id: "operating-expenses", label: "Operating Expenses", validTypes: ["Operating Expense"] },
    { id: "other-income", label: "Other Income and Expense", validTypes: ["Other Income and Expense"] },
  ];

  const cashFlowZones = [
    { id: "operating", label: "Operating Activities", validTypes: ["Operating"] },
    { id: "investing", label: "Investing Activities", validTypes: ["Investing"] },
    { id: "financing", label: "Financing Activities", validTypes: ["Financing"] },
  ];

  const getZones = () => {
    switch (activeStatement) {
      case "balance-sheet":
        return balanceSheetZones;
      case "income-statement":
        return incomeStatementZones;
      case "cash-flow":
        return cashFlowZones;
      default:
        return [];
    }
  };

  const getFilteredAccounts = () => {
    if (activeStatement === "balance-sheet") {
      return accounts.filter((a) => a.financialStatement === "Statement of Financial Position");
    } else if (activeStatement === "income-statement") {
      return accounts.filter((a) => a.financialStatement === "Income Statement");
    } else {
      return accounts.filter((a) => a.financialStatement === "Statement of Cash Flows");
    }
  };

  const handleDrop = (account: Account, zoneId: string) => {
    const zone = getZones().find((z) => z.id === zoneId);
    if (!zone) return;

    const isValid = zone.validTypes.some(type => 
      account.classification.includes(type) || 
      (type === "Non-Current Asset" && (account.classification.includes("Plant Asset") || account.classification.includes("Intangible Asset")))
    );

    if (isValid) {
      setPlacedAccounts((prev) => ({
        ...prev,
        [zoneId]: [...(prev[zoneId] || []), account],
      }));
      toast.success(`Correct! ${account.accountTitle} → ${zone.label}`);
    } else {
      toast.error(`Incorrect placement. ${account.accountTitle} doesn't belong in ${zone.label}`);
    }
  };

  const handleRemove = (account: Account, zoneId: string) => {
    setPlacedAccounts((prev) => ({
      ...prev,
      [zoneId]: (prev[zoneId] || []).filter((a) => a.accountTitle !== account.accountTitle),
    }));
  };

  const handleCheckAnswers = () => {
    const totalPlaced = Object.values(placedAccounts).reduce((sum, arr) => sum + arr.length, 0);
    const totalExpected = getFilteredAccounts().length;
    
    toast.info(`You've placed ${totalPlaced} out of ${totalExpected} accounts`);
  };

  const handleReset = () => {
    setPlacedAccounts({});
    toast.info("Canvas cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-accent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Drag & Drop <span className="text-primary">Builder</span>
          </h1>
          <div className="w-32" />
        </div>

        <Tabs value={activeStatement} onValueChange={(v) => setActiveStatement(v as StatementType)} className="mb-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="income-statement">Income Statement</TabsTrigger>
            <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid lg:grid-cols-[350px,1fr] gap-6 mb-6">
          <AccountPool 
            accounts={getFilteredAccounts()} 
            placedAccounts={placedAccounts}
          />
          
          <div className="space-y-4">
            {getZones().map((zone) => (
              <DropZone
                key={zone.id}
                id={zone.id}
                label={zone.label}
                accounts={placedAccounts[zone.id] || []}
                onDrop={(account) => handleDrop(account, zone.id)}
                onRemove={(account) => handleRemove(account, zone.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Canvas
          </Button>
          <Button variant="outline" size="lg" onClick={handleCheckAnswers}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Check Answers
          </Button>
          <Button size="lg" onClick={() => setShowSolutions(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Show Solutions
          </Button>
        </div>
      </div>

      <SolutionsOverlay
        open={showSolutions}
        onClose={() => setShowSolutions(false)}
        statementType={activeStatement}
        zones={getZones()}
        accounts={getFilteredAccounts()}
      />
    </div>
  );
};

export default DragDrop;
