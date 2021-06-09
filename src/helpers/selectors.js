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