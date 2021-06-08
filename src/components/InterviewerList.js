import React from 'react';
import InterviewerListItem from './InterviewerListItem';

import './InterviewerList.scss';

const InterviewerList = ({ interviewers, interviewer, setInterviewer }) => {
  const interviewersComps = interviewers.map(i => {
    return <InterviewerListItem id={i.id} name={i.name} avatar={i.avatar} selected={i.id === interviewer} setInterviewer={setInterviewer} key={i.id} />
  });
  
  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">{interviewersComps}</ul>
    </section>
  );
};

export default InterviewerList;