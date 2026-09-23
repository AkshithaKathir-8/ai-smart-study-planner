import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/ui/PageHeader";

import { usePlanner } from "../../context/PlannerContext";

import SessionCard from "../../components/planner/SessionCard";
import EditSessionModal from "../../components/planner/EditSessionModal";
import AddSessionModal from "../../components/planner/AddSessionModal";

import { useState } from "react";

function Planner() {

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const {
    sessions,
    loading,
    deleteSession,
    updateSession,
    fetchSessions,
  } = usePlanner();

  const [openModal, setOpenModal] = useState(false);

  //------------------------------------------------
  // Complete / Undo
  //------------------------------------------------

  const handleToggleStatus = async (session) => {

    const newStatus =
      session.status === "Completed"
        ? "Pending"
        : "Completed";

    await updateSession(session._id, {
      ...session,
      status: newStatus,
    });

    fetchSessions();

  };

  return (

    <MainLayout>

      <div className="space-y-8">

        <div className="flex justify-between items-center">

          <PageHeader
            title="AI Study Planner"
            subtitle="Organize your learning schedule with intelligent recommendations."
          />

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700"
          >
            + Add Study Session
          </button>

        </div>

        {loading ? (

          <p className="text-slate-500">
            Loading sessions...
          </p>

        ) : sessions.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">

            <h2 className="text-xl font-bold">
              No Study Sessions Yet
            </h2>

            <p className="text-slate-500 mt-2">
              Create your first AI-powered study plan.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {sessions.map((session) => (

              <SessionCard

                key={session._id}

                session={session}

                onDelete={deleteSession}

                onToggleStatus={handleToggleStatus}

                onEdit={(session) => {

                  setSelectedSession(session);

                  setOpenEdit(true);

                }}

              />

            ))}

          </div>

        )}

      </div>

      <AddSessionModal

        open={openModal}

        onClose={() => {

          setOpenModal(false);

          fetchSessions();

        }}

      />

      <EditSessionModal

        open={openEdit}

        onClose={() => {

          setOpenEdit(false);

          fetchSessions();

        }}

        session={selectedSession}

      />

    </MainLayout>

  );

}

export default Planner;