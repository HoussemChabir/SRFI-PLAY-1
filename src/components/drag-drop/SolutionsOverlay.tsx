import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

interface Zone {
  id: string;
  label: string;
  validTypes: string[];
}

interface SolutionsOverlayProps {
  open: boolean;
  onClose: () => void;
  statementType: string;
  zones: Zone[];
  accounts: Account[];
}

const SolutionsOverlay = ({ open, onClose, zones, accounts }: SolutionsOverlayProps) => {
  const getSolutionForZone = (zone: Zone) => {
    return accounts.filter((account) =>
      zone.validTypes.some(type => 
        account.classification.includes(type) ||
        (type === "Non-Current Asset" && (account.classification.includes("Plant Asset") || account.classification.includes("Intangible Asset")))
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Solutions - Correct Account Placements</DialogTitle>
          <DialogDescription>
            Review the correct placement for all accounts in this financial statement
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {zones.map((zone) => {
              const solutionAccounts = getSolutionForZone(zone);
              return (
                <div key={zone.id} className="border rounded-lg p-4 bg-card">
                  <h3 className="font-semibold text-lg mb-3 text-primary">{zone.label}</h3>
                  <div className="space-y-2">
                    {solutionAccounts.map((account) => (
                      <div
                        key={account.accountTitle}
                        className="flex items-center justify-between p-3 bg-secondary rounded-md"
                      >
                        <span className="font-medium">{account.accountTitle}</span>
                        <div className="flex gap-2">
                          <Badge variant="outline">{account.classification}</Badge>
                          <Badge variant="outline">{account.normalBalance}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SolutionsOverlay;
