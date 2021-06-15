import React from "react";
import classNames from 'classnames';

import './DayListItem.scss';

export default function DayListItem({name, spots, selected, setDay}) {
  const itemClass = classNames('day-list__item', {
    'day-list__item--selected': selected,
    'day-list__item--full': spots === 0
  });

  const formatSpots = (remaining) => {
    if (remaining === 0) {
      return 'no spots remaining';
    } else if (remaining === 1) {
      return '1 spot remaining';
    }
    return `${remaining} spots remaining`;
  };

  return (
    <li onClick={() => setDay(name)} className={itemClass} data-testid="day">
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  );
}