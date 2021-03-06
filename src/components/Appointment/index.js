import React from "react";

import "./styles.scss";
import useVisualMode from "../../hooks/useVisualMode";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

// Mode constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

const Appointment = (props) => {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const save = async (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };

    // Saving a new,or updating an existing appointment
    transition(SAVING);
    try {
        await props.bookInterview(props.id, interview);
        transition(SHOW);
    } catch {
      transition(ERROR_SAVE, true);
    }
  };

  // Cancelling / deleting an appointment
  const deleteInterviewConfirmed = async () => {
    transition(DELETING, true);
    try {
      await props.cancelInterview(props.id);
      transition(EMPTY);
    } catch {
      transition(ERROR_DELETE, true);
    }
  };

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer.name}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={back} />}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message="Deleting" />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={deleteInterviewConfirmed}
          message="Are you sure you would like to delete?"
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
      {mode === ERROR_SAVE && <Error message="Error saving appointment" onClose={back} />}
      {mode === ERROR_DELETE && <Error message="Error deleting appointment" onClose={back} />}
    </article>
  );
};

export default Appointment;
