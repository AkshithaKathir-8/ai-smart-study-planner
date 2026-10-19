import { useState } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  ClipboardCheck,
  TrendingUp,
  BookOpen,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import AttendanceStats from "../../components/attendance/AttendanceStats";
import AttendanceCard from "../../components/attendance/AttendanceCard";
import AddAttendanceModal from "../../components/attendance/AddAttendanceModal";

import { useAttendance } from "../../context/AttendanceContext";

function Attendance() {
  const {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
  } = useAttendance();

  const [openModal, setOpenModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleSave = async (record) => {
    try {
      if (editingRecord) {
        await updateRecord({
          ...record,
          _id: editingRecord._id,
        });

        toast.success("Attendance updated!");
      } else {
        await addRecord(record);
        toast.success("Attendance added!");
      }

      setEditingRecord(null);
      setOpenModal(false);
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this attendance record?")) {
      await deleteRecord(id);
      toast.success("Attendance deleted!");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-8">

        {/* Page heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <ClipboardCheck
                  size={19}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-sm font-semibold text-indigo-600">
                Academic Overview
              </span>
            </div>

            <PageHeader
              title="Attendance"
              subtitle="Monitor your attendance and stay on track with every subject."
            />
          </div>

          <button
            onClick={() => {
              setEditingRecord(null);
              setOpenModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus size={19} />
            Add Attendance
          </button>
        </div>

        {/* Overview banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 p-7 text-white shadow-xl shadow-indigo-100">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-2">
                Your academic consistency
              </p>

              <h2 className="text-2xl md:text-3xl font-bold">
                Keep showing up. Keep progressing.
              </h2>

              <p className="mt-2 text-indigo-100 max-w-xl text-sm md:text-base">
                Track every class, understand your attendance level,
                and identify subjects that need attention.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
                <TrendingUp size={24} />
              </div>

              <div>
                <p className="text-xs text-indigo-100">
                  Subjects tracked
                </p>
                <p className="text-2xl font-bold">
                  {records.length}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-12 -top-16 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-24 w-56 h-56 rounded-full bg-white/5" />
        </div>

        {/* Stats */}
        <AttendanceStats records={records} />

        {/* Subject records */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Subject Attendance
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your attendance performance by subject
              </p>
            </div>

            {records.length > 0 && (
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                <BookOpen size={15} />
                {records.length} subject{records.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {records.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-3xl py-16 px-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <ClipboardCheck
                  size={30}
                  className="text-indigo-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                No attendance records yet
              </h3>

              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Start tracking your attendance by adding your
                first subject record.
              </p>

              <button
                onClick={() => {
                  setEditingRecord(null);
                  setOpenModal(true);
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                <Plus size={18} />
                Add Attendance
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {records.map((record) => (
                <AttendanceCard
                  key={record._id}
                  record={record}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddAttendanceModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingRecord(null);
        }}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </MainLayout>
  );
}

export default Attendance;