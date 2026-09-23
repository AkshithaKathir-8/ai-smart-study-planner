import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useSubjects } from "../../context/SubjectContext";

function AddAttendanceModal({
  open,
  onClose,
  onSave,
  initialData,
}) {

  const { subjects } = useSubjects();

  const [formData, setFormData] = useState({

    subjectId: "",

    attended: 0,

    total: 0,

  });

  useEffect(() => {

    if (initialData) {

      setFormData({

        subjectId:
          initialData.subjectId?._id ||
          initialData.subjectId ||
          "",

        attended: initialData.attended,

        total: initialData.total,

      });

    }

    else {

      setFormData({

        subjectId: "",

        attended: 0,

        total: 0,

      });

    }

  }, [initialData]);

  if (!open) return null;

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.type === "number"
          ? Number(e.target.value)
          : e.target.value,

    });

  };

  const handleSubmit = () => {

    if (!formData.subjectId) {

      alert("Please select a subject");

      return;

    }

    if (formData.attended > formData.total) {

      alert("Attended classes cannot exceed Total classes");

      return;

    }

    onSave(formData);

  };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl">

        <div className="flex justify-between items-center mb-8">

          <h2 className="text-2xl font-bold">

            {initialData
              ? "Edit Attendance"
              : "Add Attendance"}

          </h2>

          <button onClick={onClose}>

            <X size={22} />

          </button>

        </div>

        <div className="space-y-5">

          <select

            name="subjectId"

            value={formData.subjectId}

            onChange={handleChange}

            className="w-full border rounded-2xl px-4 py-3"

          >

            <option value="">

              Select Subject

            </option>

            {subjects.map((subject) => (

              <option

                key={subject._id}

                value={subject._id}

              >

                {subject.name}

              </option>

            ))}

          </select>

          <input

            type="number"

            name="attended"

            value={formData.attended}

            onChange={handleChange}

            placeholder="Classes Attended"

            className="w-full border rounded-2xl px-4 py-3"

          />

          <input

            type="number"

            name="total"

            value={formData.total}

            onChange={handleChange}

            placeholder="Total Classes"

            className="w-full border rounded-2xl px-4 py-3"

          />

          <button

            onClick={handleSubmit}

            className="w-full bg-indigo-600 text-white rounded-2xl py-3 font-semibold hover:bg-indigo-700"

          >

            {initialData
              ? "Update Attendance"
              : "Save Attendance"}

          </button>

        </div>

      </div>

    </div>

  );

}

export default AddAttendanceModal;