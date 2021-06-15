import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  getAllByTestId,
  getByAltText,
  fireEvent,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  prettyDOM,
  getByDisplayValue,
  getByTestId
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);
    return waitForElement(() => getByText("Monday"));
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find((d) => queryByText(d, "Monday"));
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render component
    const { container } = render(<Application />);

    // 2. Wait for data to be loaded by waiting for the text "Archie Cohen" to be displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the delete button for the booked appointment
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that confirmation message is shown
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click on confirm button
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Wait for "Deleting" to be displayed
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    // 7. Wait for add button to be displayed
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));
    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    // 8. Check days remaining for Monday has the text "2 spots remaining"
    const day = getAllByTestId(container, "day").find((d) => queryByText(d, "Monday"));
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render component
    const { container } = render(<Application />);

    // 2. Wait for data to be loaded by waiting for "Archie Cohen"
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the edit button for the appointment
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that form is loaded with student name
    expect(getByTestId(appointment, "student-name-input")).toHaveValue("Archie Cohen");

    // 5. Change interviewer to 1, "Sylvia Palmer"
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click "Save"
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check for "Saving"
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 8. Check that interviewer is "Tori Malcom"
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    // 9. Ceck that days remaining has text "1 spot remaining"
    const day = getAllByTestId(container, "day").find((d) => queryByText(d, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
});
