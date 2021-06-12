import { useEffect, useState } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {},
  });

  const bookInterview = (id, interview) => {
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };

      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      setState({ ...state, appointments });
    });
  };

  const cancelInterview = (appointmentId) => {
    return axios.delete(`/api/appointments/${appointmentId}`).then(() => {
      const appointment = {
        ...state.appointments[appointmentId],
        interview: null,
      };

      const appointments = {
        ...state.appointments,
        [appointmentId]: appointment,
      };

      setState({ ...state, appointments });
    });
  };

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const apptPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");

    Promise.all([daysPromise, apptPromise, interviewersPromise])
      .then((all) =>
        setState((prev) => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        }))
      )
      .catch((err) => console.error(err));
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
