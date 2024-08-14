import { columns } from "@/components/tables/columns";
import { DataTable } from "@/components/tables/data-table";

import { quotes } from "@/data/quotes/quotes";


const Dashboard = () => {
  return (
    <div className="m-auto p-5 pt-24">
      <DataTable data={quotes} columns={columns} />
    </div>
  );
};

export default Dashboard;
