import {
  FaMoneyBillWave,
  FaHistory,
  FaFileAlt,
  FaChartLine,
} from "react-icons/fa";
import {
  AlignEndHorizontal,
  ArrowRightLeft,
  History,
  Landmark,
} from "lucide-react";
import "./buttons.css";

const buttons = [
  { icon: <FaMoneyBillWave size={40} color="#4CAF50" />, label: "Pay" },
  { icon: <FaHistory size={40} color="#FF9800" />, label: "History" },
  { icon: <FaFileAlt size={40} color="#2196F3" />, label: "Report Complaint" },
  { icon: <FaChartLine size={40} color="#673AB7" />, label: "Investment" },
];

export default function NavButtons() {
  return (
    <div className="btns">
      <div className="button-16">
          <History size={30} />
          <p>History</p>
      </div>
      <div className="button-16">
        <ArrowRightLeft  size={30}/>
        <p>Pay</p>
      </div>
      
      
      <div className="button-16">
        <Landmark size={35} />
        <p>Investment</p>
      </div>
      
      
      <div className="button-16">
        <AlignEndHorizontal  size={35}/>
        <p>Report</p>
      </div>
    </div>
  );
}
