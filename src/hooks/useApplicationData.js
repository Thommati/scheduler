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
        appointments: {
          ...state.appointments,
          [action.id]: {
            ...state.appointments[action.id],
            interview: action.interview,
          },
        },
        days: [
          ...state.days.map((d, i) => {
            if (d.name !== state.day) {
              return d;
            }
            return {
              ...d,
              spots: action.interview ? (state.appointments[action.id].interview ? d.spots : d.spots - 1) : d.spots + 1,
            };
          }),
        ],
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

  const bookInterview = async (id, interview) => {
    try {
      await axios.put(`/api/appointments/${id}`, { interview });
    } catch (err) {
      throw err;
    }
    // dispatch({ type: SET_INTERVIEW, id, interview });
  };

  const cancelInterview = async (id) => {
    await axios.delete(`/api/appointments/${id}`);
    // dispatch({ type: SET_INTERVIEW, id, interview: null });
  };

  const setDay = (day) => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    // Set up web socket
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = () => socket.send('ping');

    // Call dispatch if message with data field is receied.
    socket.onmessage = event => {
      const data = JSON.parse(event.data);
      if (data.type) {
        dispatch({ ...data });
      }
    };

    const fetchData = async () => {
      const daysPromise = axios.get("/api/days");
      const apptPromise = axios.get("/api/appointments");
      const interviewersPromise = axios.get("/api/interviewers");

      const all = await Promise.all([daysPromise, apptPromise, interviewersPromise]);
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      });
    };
    fetchData();
  }, []);

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
