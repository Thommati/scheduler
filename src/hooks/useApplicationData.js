import { useEffect, useState } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    days: [],
    day: "Monday",
    appointments: {},
    interviewers: {},
  });

  // Adjust spots remaining for props.day and replace that day in the days array
  const adjustDays = (appointments) => {
    const days = [...state.days];
    const day = { ...days.filter((d) => d.name === state.day)[0] };
    day.spots = day.appointments.reduce(
      (acc, curr) => (appointments[curr].interview ? acc : acc + 1),
      0
    );
    days.splice(day.id - 1, 1, day);
    return days;
  };

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

      // Adjust spots
      const days = adjustDays(appointments);

      setState({ ...state, appointments, days });
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

      // Adjust spos
      const days = adjustDays(appointments);

      setState({ ...state, appointments, days });
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
