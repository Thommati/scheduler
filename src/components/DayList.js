import React from 'react';
import DayListItem from './DayListItem';

export default function(props) {
  const dayListItems = props.days.map(d => {
    return <DayListItem
      key={d.id}
      name={d.name}
      spots={d.spots}
      setDay={props.setDay}
      selected={d.name === props.day}
    />;
  });
  return <ul>{dayListItems}</ul>;
}