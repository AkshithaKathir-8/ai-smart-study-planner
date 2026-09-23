import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import AnalyticsStats from "../../components/analytics/AnalyticsStats";
import WeeklyChart from "../../components/analytics/WeeklyChart";
import SubjectProgressChart from "../../components/analytics/SubjectProgressChart";
import AttendanceChart from "../../components/analytics/AttendanceChart";
import InsightsCard from "../../components/analytics/InsightsCard";

function Analytics() {

  return (

    <MainLayout>

      <div className="space-y-8">

        <PageHeader
          title="Analytics Dashboard"
          subtitle="Track your academic performance and productivity."
        />

        <AnalyticsStats />

        <div className="grid lg:grid-cols-2 gap-8">

          <WeeklyChart />

          <AttendanceChart />

        </div>

        <SubjectProgressChart />

        <InsightsCard />

      </div>

    </MainLayout>

  );

}

export default Analytics;