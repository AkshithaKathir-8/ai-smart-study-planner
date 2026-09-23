import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";

import WelcomeCard from "../../components/dashboard/WelcomeCard";
import AIInsightCard from "../../components/dashboard/AIInsightCard";
import ProgressCard from "../../components/dashboard/ProgressCard";
import StudyChart from "../../components/dashboard/StudyChart";
import UpcomingTasks from "../../components/dashboard/UpcomingTasks";
import StatsCard from "../../components/dashboard/StatsCard";
import RecentActivity from "../../components/dashboard/RecentActivity";

import {
  BookOpen,
  CheckSquare,
  Users,
  TrendingUp,
} from "lucide-react";

import { getAnalytics } from "../../services/analyticsService";

import { useSubjects } from "../../context/SubjectContext";
import { usePlanner } from "../../context/PlannerContext";
import { useCalendar } from "../../context/CalendarContext";

function Dashboard() {
  const { subjects } = useSubjects();
  const { sessions } = usePlanner();
  const { events } = useCalendar();

  const [analytics, setAnalytics] = useState({
    totalSubjects: 0,
    totalPlanner: 0,
    totalNotes: 0,
    totalEvents: 0,
    averageAttendance: 0,
    averageProgress: 0,
    attendanceChart: [],
    subjectProgress: [],
  });

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [subjects, sessions, events]);

  return (
    <MainLayout>
      <div className="space-y-10">
        <WelcomeCard />

        <AIInsightCard />

        {/* Statistics */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Subjects"
            value={analytics.totalSubjects}
            icon={BookOpen}
            color="from-indigo-500 to-purple-600"
          />

          <StatsCard
            title="Study Sessions"
            value={analytics.totalPlanner}
            icon={CheckSquare}
            color="from-emerald-500 to-green-600"
          />

          <StatsCard
            title="Attendance"
            value={`${analytics.averageAttendance}%`}
            icon={Users}
            color="from-orange-400 to-red-500"
          />

          <StatsCard
            title="Overall Progress"
            value={`${analytics.averageProgress}%`}
            icon={TrendingUp}
            color="from-pink-500 to-rose-600"
          />
        </div>

        {/* Progress and study chart */}
        <div className="grid gap-8 lg:grid-cols-2">
          <ProgressCard />
          <StudyChart />
        </div>

        {/* Upcoming tasks and recent activity */}
        <div className="grid gap-8 lg:grid-cols-2">
          <UpcomingTasks />
          <RecentActivity />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;