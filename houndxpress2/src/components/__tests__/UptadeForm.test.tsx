import React from "react";
import UpdateForm from "../Modals/ModalUpdate/UpdateForm";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import guidesReducer from "../../state/guides.slice";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import { GuidesState } from "../../state/types";

describe("UpdateForm", () => {
  const defaultState: GuidesState = {
    guides: [],
    menuDisplay: false,
    modalData: { guideNumber: "", typeModal: "" },
  };

  const renderWithStore = (overrides = {}) => {
    const store = configureStore({
      reducer: { guides: guidesReducer },
      preloadedState: {
        guides: { ...defaultState, ...overrides },
      },
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={Theme}>
          <UpdateForm />
        </ThemeProvider>
      </Provider>
    );
    return store;
  };

  it("should render the update form", () => {
    renderWithStore();
    const newStatelabel = screen.getByText(/Nuevo estado/i, {
      selector: "label",
    });
    const newStateInput = screen.getByTitle(
      "Selecciona el estado actualizado del envío"
    );
    expect(newStatelabel).toBeInTheDocument();
    expect(newStateInput).toBeInTheDocument();
  });

  it("should render labels and inputs", () => {
    renderWithStore();
    //Labels
    const labels = [
      "Nuevo estado:",
      "Fecha de la última actualización:",
      "Hora de la última actualización:",
    ];
    labels.forEach((labelText) => {
      const label = screen.getByLabelText(labelText);
      expect(label).toBeInTheDocument();
    });

    //inputs
    const inputsTitle = [
      "Selecciona el estado actualizado del envío",
      "Añade la fecha de creación en el formato que se indica",
      "Añade la hora de la actualización",
    ];
    inputsTitle.forEach((title) => {
      const input = screen.getByTitle(title);
      expect(input).toBeInTheDocument();
    });

    //Select options
    const selectOptions = ["Nuevo estado:", "En tránsito 🚚", "Entregado ✅"];
    selectOptions.forEach((optionText) => {
      const option = screen.getByText(optionText, { selector: "option" });
      expect(option).toBeInTheDocument();
    });

    //Button submit
    const submitButton = screen.getByRole("button", { name: /actualizar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("should display error messages when inputs are empty", () => {
    renderWithStore();
    const submitButton = screen.getByRole("button", { name: /actualizar/i });
    fireEvent.click(submitButton);
    const errorMessages = screen.getAllByText(/este campo es obligatorio/i);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages.length).toBe(3);
  });

  it("should clear error messages on input focus", () => {
    renderWithStore();
    const submitButton = screen.getByRole("button", { name: /actualizar/i });
    fireEvent.click(submitButton);

    // Check if error messages are displayed
    const errorMessages = screen.getAllByText(/este campo es obligatorio/i);
    expect(errorMessages.length).toBeGreaterThan(0);
    expect(errorMessages.length).toBe(3);

    // Focus on the first input to clear errors
    const inputsTitle = [
      "Selecciona el estado actualizado del envío",
      "Añade la fecha de creación en el formato que se indica",
      "Añade la hora de la actualización",
    ];
    inputsTitle.forEach((title) => {
      const input = screen.getByTitle(title);
      expect(input).toBeInTheDocument();

      const inputIndex = inputsTitle.indexOf(title);
      expect(errorMessages[inputIndex]).toBeInTheDocument();

      // Focus on the input to clear the error
      fireEvent.focus(input);
      expect(errorMessages[inputIndex]).toHaveTextContent("");
    });
  });

  it("should render delivered message when the guide is delivered", () => {
    const mockModalData = {
      guideNumber: "123456",
      typeModal: "update",
    };
    const mockGuide = [
      {
        guide__number: "123456",
        guide__origin: "Ciudad A",
        guide__destination: "Ciudad B",
        guide__recipient: "Juan Perez",
        guide__stage: [
          {
            guide__status: "Entregado",
            guide__date: "2024-06-24",
            guide__hour: "10:00",
          },
        ],
      },
    ];

    renderWithStore({
      modalData: mockModalData,
      guides: mockGuide,
    });

    const deliveredMessage = screen.getByText(/Tu envío ya fue entregado/i);
    expect(deliveredMessage).toBeInTheDocument();
  });
});
