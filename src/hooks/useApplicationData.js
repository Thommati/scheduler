import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day,
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW:
      return {
        ...state,
        [state.appointments[action.id]]: action.interview,
      };
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
};

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
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
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview }));
  };

  const cancelInterview = (id) => {
    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }));
  };

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    const daysPromise = axios.get("/api/days");
    const apptPromise = axios.get("/api/appointments");
    const interviewersPromise = axios.get("/api/interviewers");

    Promise.all([daysPromise, apptPromise, interviewersPromise])
      .then((all) =>
        dispatch({
          type: SET_APPLICATION_DATA,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data,
        })
      )
      .catch((err) => console.error(err));
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
