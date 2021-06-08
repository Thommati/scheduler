import React from 'react';
import InterviewerListItem from './InterviewerListItem';

import './InterviewerList.scss';

const InterviewerList = ({ interviewers, value, onChange }) => {
  const interviewerListItems = interviewers.map(i => {
    return (
      <InterviewerListItem
        name={i.name}
        avatar={i.avatar}
        selected={i.id === value}
        setInterviewer={(event) => onChange(i.id)}
        key={i.id}
      />
    );
  });
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewerListItems}</ul>
    </section>
  );
};

export default InterviewerList;