import React from "react";
import { Filter, Download, BarChart3 } from "lucide-react";
import Button from "../../common/Button";
import { useNavigate } from "react-router-dom";
import { PRIVATE_PATHS } from "../../../routes/constants";

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user") || "null");
  const firstName = user?.firstName || "Admin";

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-[30px] font-bold text-[#101828]">
          Welcome {firstName}
        </h1>
        <p className="text-[#475467] text-base mt-1">
          Here is all the information you need on Shift9ja today
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          label="Full Analytics"
          variant="outline"
          fullWidth={false}
          className="!h-10 border-[#F2F4F7]"
          icon={<BarChart3 size={18} />}
          onClick={() => navigate(PRIVATE_PATHS.ANALYTICS)}
        />
        <Button
          label="Export Data"
          variant="primary"
          fullWidth={false}
          className="!h-10 px-6 gap-2"
          icon={<Download size={18} />}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
