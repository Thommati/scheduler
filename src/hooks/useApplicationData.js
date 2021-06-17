import { useEffect, useReducer } from 'react';
import axios from 'axios';

import reducer, { SET_DAY, SET_APPLICATION_DATA } from 'reducers/application';

const useApplicationData = () => {
  const [state, dispatch] = useReducer(reducer, {
    days: [],
    day: 'Monday',
    appointments: {},
    interviewers: {},
  });

  const bookInterview = async (id, interview) => {
    try {
      await axios.put(`/api/appointments/${id}`, { interview });
    } catch (err) {
      throw err;
    }
  };

  const cancelInterview = async (id) => {
    await axios.delete(`/api/appointments/${id}`);
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
      const daysPromise = axios.get('/api/days');
      const apptPromise = axios.get('/api/appointments');
      const interviewersPromise = axios.get('/api/interviewers');

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
