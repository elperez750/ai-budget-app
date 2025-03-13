import { PieChart } from "lucide-react";
import { Navbar } from "./components/Navbar";
import RecentTransactions from "./components/RecentTransactions";
import { PieChartSpending } from "./components/PieChartSpending";

export default function Home() {
  return (
  
    <div>
      
      <RecentTransactions />
      <PieChartSpending />
      
    </div>
  );
}
