import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, RotateCcw, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import AccountPool from "@/components/drag-drop/AccountPool";
import DropZone from "@/components/drag-drop/DropZone";
import SolutionsOverlay from "@/components/drag-drop/SolutionsOverlay";
import CashFlowStructure from "@/components/drag-drop/CashFlowStructure";
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
  const [showCashFlowStructure, setShowCashFlowStructure] = useState(false);

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

  // More granular zones for cash-flow mode, include final steps
  const cashFlowZones = [
    { id: "operating-direct", label: "Operating Activities — Direct", validTypes: ["Operating"] },
    { id: "operating-indirect", label: "Operating Activities — Indirect", validTypes: ["Operating"] },
    { id: "investing", label: "Investing Activities", validTypes: ["Investing"] },
    { id: "financing", label: "Financing Activities", validTypes: ["Financing"] },
    { id: "net-change", label: "Net increase (decrease) in cash", validTypes: ["Final"] },
    { id: "opening", label: "Cash at beginning of period", validTypes: ["Final"] },
    { id: "ending", label: "Cash at end of period", validTypes: ["Final"] },
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
      // Provide a curated set of cash-flow draggable options for the cash-flow builder
      const cashFlowAccounts: Account[] = [
        { accountTitle: "Cash received from customers", classification: "Operating", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },
        { accountTitle: "Cash paid to suppliers and employees", classification: "Operating", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Interest paid/received (if core)", classification: "Operating", financialStatement: "Statement of Cash Flows", normalBalance: "Mixed" },
        { accountTitle: "Taxes paid", classification: "Operating", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Adjustments for non-cash items (depreciation, amortization)", classification: "Operating", financialStatement: "Statement of Cash Flows", normalBalance: "None" },

        { accountTitle: "Purchase of property, plant, and equipment (PPE)", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Sale of PPE", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },
        { accountTitle: "Purchase of investments", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Sale of investments", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },
        { accountTitle: "Loans given to others", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Loans collected from others", classification: "Investing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },

        { accountTitle: "Issuance of shares (equity)", classification: "Financing", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Repurchase of shares", classification: "Financing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },
        { accountTitle: "Borrowing money (debt)", classification: "Financing", financialStatement: "Statement of Cash Flows", normalBalance: "Credit" },
        { accountTitle: "Repayment of debt", classification: "Financing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },
        { accountTitle: "Dividends paid", classification: "Financing", financialStatement: "Statement of Cash Flows", normalBalance: "Debit" },

        // Final steps (targets)
        { accountTitle: "(Target) Net increase (decrease) in cash", classification: "Final", financialStatement: "Statement of Cash Flows", normalBalance: "None" },
        { accountTitle: "(Target) Cash at beginning of period", classification: "Final", financialStatement: "Statement of Cash Flows", normalBalance: "None" },
        { accountTitle: "(Target) Cash at end of period", classification: "Final", financialStatement: "Statement of Cash Flows", normalBalance: "None" },
      ];

      return cashFlowAccounts;
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

        <div className="flex gap-4 justify-center flex-wrap">
          <Button variant="outline" size="lg" onClick={handleReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Canvas
          </Button>
          <Button variant="outline" size="lg" onClick={handleCheckAnswers}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Check Answers
          </Button>
          {activeStatement === "cash-flow" && (
            <Button variant="outline" size="lg" onClick={() => setShowCashFlowStructure(true)}>
              <BookOpen className="mr-2 h-4 w-4" />
              View Structure
            </Button>
          )}
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

      <CashFlowStructure
        open={showCashFlowStructure}
        onClose={() => setShowCashFlowStructure(false)}
      />
    </div>
  );
};

export default DragDrop;
