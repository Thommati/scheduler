import React from 'react';
import classNames from 'classnames';

import './InterviewerListItem.scss';

const InterviewerListItem = (props) => {
  const { id, name, avatar, selected, setInterviewer } = props;
  const itemClasses = classNames("interviewers__item", {
    'interviewers__item--selected': selected
  });
  
  return (
    <li className={itemClasses} onClick={() => setInterviewer(id)}>
      <img
        className="interviewers__item-image"
        src={avatar}
        alt={name}
      />
      {name}
    </li>
  );
};

export default InterviewerListItem;