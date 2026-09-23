import api from "./api";

export const getAttendance = async () => {
  const res = await api.get("/attendance");
  return res.data;
};

export const createAttendance = async (record) => {
  const res = await api.post("/attendance", record);
  return res.data;
};

export const updateAttendance = async (id, record) => {
  const res = await api.put(`/attendance/${id}`, record);
  return res.data;
};

export const deleteAttendance = async (id) => {
  const res = await api.delete(`/attendance/${id}`);
  return res.data;
};