import React, { useEffect, useState } from "react";
import axios from 'axios';

import "components/Application.scss";
import { getAppointmentsForDay } from "../helpers/selectors";

import DayList from './DayList';
import Appointment from './Appointment';

export default function Application(props) {
  const [state, setState] = useState({days: [], day: 'Monday', appointments: {}});

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    const daysPromise = axios.get('/api/days');
    const apptPromise = axios.get('/api/appointments');

    Promise.all([daysPromise, apptPromise])
      .then(all => setState(prev => ({...prev, days: all[0].data, appointments: all[1].data})))
      .catch(err => console.error(err));
  }, []);


  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map(appointment => <Appointment {...appointment} key={appointment.id} />)}
        <Appointment time="5pm" key="last"/>
      </section>
    </main>
  );
}
