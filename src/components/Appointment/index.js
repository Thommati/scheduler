import React from "react";
import axios from "axios";
import useVisualMode from "../../hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING"

const Appointment = (props) => {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    
    transition(SAVING);
    axios.put(`/api/appointments/${props.id}`, {interview})
      .then(response => {
        if (response.request.status === 204) {
          props.bookInterview(props.id  , interview);
          transition(SHOW);
        }
      })
      .catch(err => console.error(err));
  };

  const deleteInterview = () => {
    transition(DELETING);
    axios.delete(`/api/appointments/${props.id}`)
      .then(response => {
        if (response.request.status === 204) {
          props.cancelInterview(props.id);
          transition(EMPTY);
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={deleteInterview}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          name=""
          interviewer=""
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
    </article>
  );
};

export default Appointment;
