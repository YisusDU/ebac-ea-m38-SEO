import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GuideRegister from "../GuideReguister";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import { configureStore } from "@reduxjs/toolkit";
import guidesReducer from "../../state/guides.slice";
import { GuidesState } from "../../state/types";
import store from "../../App/store";

describe("GuideRegister component", () => {
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
          <GuideRegister />
        </ThemeProvider>
      </Provider>
    );
    return store;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the GuideRegister component", () => {
    renderWithStore();
    const guideRegister = screen.getByText("Registro de guías");
    expect(guideRegister).toBeInTheDocument();
  });

  it("should render the form with inputs and labels", () => {
    renderWithStore();
    const labelTexts = [
      "Número de guía:",
      "Origen:",
      "Destino:",
      "Destinatario:",
      "Fecha de creación:",
      "Hora de creación:",
    ];
    for (const labelText of labelTexts) {
      const label = screen.getByLabelText(labelText);
      expect(label).toBeInTheDocument();

      const input = screen.getByPlaceholderText(labelText);
      expect(input).toBeInTheDocument();
    }

    const guideStatusLabel = screen.getByLabelText("Estado inicial:");
    expect(guideStatusLabel).toBeInTheDocument();
    const guideStatusSelect = screen.getByRole("combobox");
    expect(guideStatusSelect).toBeInTheDocument();

    const submitButton = screen.getByText(/enviar/i);
    expect(submitButton).toBeInTheDocument();
  });

  it("should render the animation on form hover", () => {
    renderWithStore();
    const pawsIMG = screen.getAllByAltText("paw-svg");

    expect(pawsIMG.length).toBeGreaterThan(0);
    expect(pawsIMG.length).toBe(5);
    expect(pawsIMG.length).not.toBe(6);
  });

  it("should call handleValidate on form submission", () => {
    renderWithStore();
    const submitButton = screen.getByText(/enviar/i);
    fireEvent.click(submitButton);
    const messagesError = screen.getAllByText(/Este campo es obligatorio/i);

    expect(messagesError.length).toBeGreaterThan(0);
    expect(messagesError.length).toBe(7);
  });

  it("should clear errors on input focus", () => {
    renderWithStore();
    const submitButton = screen.getByText(/enviar/i);
    fireEvent.click(submitButton);

    const guideInputs = screen.getAllByPlaceholderText("Número de guía:");
    const errorMessage = screen.getAllByText(/Este campo es obligatorio/i);

    for (let i = 0; i < guideInputs.length; i++) {
      fireEvent.focus(guideInputs[i]);
      expect(errorMessage[i]).toHaveTextContent("");
    }
  });

  it("should shows an error of guide number repeated", () => {
    renderWithStore({
      guides: [
        {
          guide__number: "12345678",
          origin: "A",
          destination: "B",
          recipient: "C",
          date: "2023-01-01",
          hour: "12:00",
          status: "pending",
        },
      ],
    });
    const guideNumberInput = screen.getByPlaceholderText("Número de guía:");
    fireEvent.change(guideNumberInput, { target: { value: "12345678" } });
    const submitButton = screen.getByText(/enviar/i);
    fireEvent.click(submitButton);
    const errorMessage = screen.getByText(/El número de guía ya existe/i);

    expect(errorMessage).toBeInTheDocument();
  });
});
