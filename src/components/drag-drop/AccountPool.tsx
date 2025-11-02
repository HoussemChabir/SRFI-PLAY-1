import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import DraggableAccount from "./DraggableAccount";

interface Account {
  accountTitle: string;
  classification: string;
  financialStatement: string;
  normalBalance: string;
}

interface AccountPoolProps {
  accounts: Account[];
  placedAccounts: { [key: string]: Account[] };
}

const AccountPool = ({ accounts, placedAccounts }: AccountPoolProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const isPlaced = (account: Account) => {
    return Object.values(placedAccounts).some((arr) =>
      arr.some((a) => a.accountTitle === account.accountTitle)
    );
  };

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountTitle.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !isPlaced(account)
  );

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Account Pool</CardTitle>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-6">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-2">
            {filteredAccounts.map((account) => (
              <DraggableAccount key={account.accountTitle} account={account} />
            ))}
            {filteredAccounts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "No accounts found" : "All accounts placed!"}
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AccountPool;
