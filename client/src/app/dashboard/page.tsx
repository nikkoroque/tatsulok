import AppHeader from "./components/Header/app-header";
import { LocationStats } from "./components/Metrics/LocationStats";
import { WarehouseCards } from "./components/Metrics/WarehouseCards";
import { CardStats } from "./components/Metrics/CardStats";
import { LaborHistory } from "./components/Metrics/LaborHistory";

export default function DashboardPage() {
  return (
    <>
      <AppHeader
        breadcrumbLink="#"
        breadcrumbLinkText="Tatsulok"
        breadcrumbPage="Dashboard"
      />
      <div className="flex flex-1 flex-col gap-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <CardStats title="Total Earnings" />
          <LaborHistory />
          <LocationStats title="In Use Locations" />
        </div>
        <div className="grid auto-rows-min gap-4 md:grid-cols-4 py-4">
        <WarehouseCards title="Aisle A" occupied={91.5} empty={8.5} />
        <WarehouseCards title="Aisle B" occupied={65.2} empty={34.8} />
        <WarehouseCards title="Aisle C" occupied={78.6} empty={21.4} />
        <WarehouseCards title="Aisle D" occupied={100} empty={0} />
      </div>
      <div className="grid auto-rows-min gap-4 grid-cols-1 h-full">
        <LaborHistory />
      </div>
      </div>
    </>
  );
}
