import { useState } from "react";
import toast from "react-hot-toast";

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

      <div className="space-y-8">

        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          <PageHeader
            title="Attendance"
            subtitle="Track attendance for every subject."
          />

          <button
            onClick={() => {

              setEditingRecord(null);
              setOpenModal(true);

            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
          >
            + Add Attendance
          </button>

        </div>

        <AttendanceStats records={records} />

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