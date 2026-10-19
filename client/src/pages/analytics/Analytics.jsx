import {
  BarChart3,
  TrendingUp,
  Sparkles,
} from "lucide-react";

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
      <div className="space-y-8 pb-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <BarChart3
                  size={19}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-sm font-semibold text-indigo-600">
                Performance Overview
              </span>
            </div>

            <PageHeader
              title="Analytics"
              subtitle="Understand your academic performance, productivity, and consistency."
            />
          </div>
        </div>

        {/* Overview banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-100">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-2">
                Your academic dashboard
              </p>

              <h2 className="text-2xl md:text-3xl font-bold">
                See your progress. Improve your consistency.
              </h2>

              <p className="mt-2 text-indigo-100 max-w-2xl text-sm md:text-base">
                Review your study activity, subject progress, attendance,
                and personalized insights from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <TrendingUp size={24} />
              </div>

              <div>
                <p className="text-xs text-indigo-100">
                  Analytics
                </p>

                <p className="text-xl font-bold">
                  Live Overview
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-24 w-56 h-56 rounded-full bg-white/5" />
        </div>

        {/* Stats */}
        <AnalyticsStats />

        {/* Main charts */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <BarChart3
                size={17}
                className="text-indigo-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Performance Trends
              </h2>

              <p className="text-sm text-slate-500">
                Track your recent study and attendance activity.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <WeeklyChart />
            <AttendanceChart />
          </div>
        </div>

        {/* Subject progress */}
        <SubjectProgressChart />

        {/* Insights */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Sparkles
                size={17}
                className="text-violet-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Personalized Insights
              </h2>

              <p className="text-sm text-slate-500">
                Helpful observations based on your academic activity.
              </p>
            </div>
          </div>

          <InsightsCard />
        </div>

      </div>
    </MainLayout>
  );
}

export default Analytics;