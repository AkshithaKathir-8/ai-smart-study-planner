import api from "./api";

// Get all events
export const getEvents = async () => {

    const response = await api.get("/calendar");

    return response.data;

};

// Create event
export const createEvent = async (event) => {

    const response = await api.post("/calendar", event);

    return response.data;

};

// Update event
export const updateEvent = async (id, event) => {

    const response = await api.put(`/calendar/${id}`, event);

    return response.data;

};

// Delete event
export const deleteEvent = async (id) => {

    const response = await api.delete(`/calendar/${id}`);

    return response.data;

};