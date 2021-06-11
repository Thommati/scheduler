export function getAppointmentsForDay(state, day) {
  if (!state.days || state.days.length === 0) {
    return [];
  }

  const dayObj = state.days.filter(d => d.name === day)[0];
  if (!dayObj) {
    return [];
  }

  const appointments = dayObj.appointments;
  if (!appointments) {
    return [];
  }

  const result = appointments.map(a => state.appointments[a]).filter(x => x);
  if (!result) {
    return [];
  }
  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerData = state.interviewers[interview.interviewer];
  
  if (!interviewerData) {
    return null;
  }

  return {
    student: interview.student,
    interviewer: {
      ...interviewerData
    }
  };
}

export function getInterviewersForDay(state, day) {
  if (!state.days || state.days.length === 0) {
    return [];
  }

  const dayObj = state.days.filter((d) => d.name === day)[0];
  if (!dayObj) {
    return [];
  }

  const interviewers = dayObj.interviewers;
  if (!interviewers) {
    return [];
  }

  const result = interviewers.map((a) => state.interviewers[a]).filter((x) => x);
  return result;
}