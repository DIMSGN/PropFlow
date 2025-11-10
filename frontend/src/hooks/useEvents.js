import { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(API_ENDPOINTS.APPOINTMENTS);
      setEvents(response.data);
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      setError(null);
      await axios.post(API_ENDPOINTS.APPOINTMENTS, eventData);
      await fetchEvents();
    } catch (err) {
      setError("Failed to create event");
      console.error("Error creating event:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, createEvent, fetchEvents };
};
