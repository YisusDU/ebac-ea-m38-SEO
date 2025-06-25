import React from "react";
import Header from "../Header";
import { fireEvent, prettyDOM, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme";
import { configureStore } from "@reduxjs/toolkit";
import guidesReducer from "../../state/guides.slice";
import { GuidesState } from "../../state/types";

describe("Header component", () => {
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
          <Header />
        </ThemeProvider>
      </Provider>
    );
    return store;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the Header component", () => {
    renderWithStore();
    const header = screen.getByText("Inicio");
    expect(header).toBeInTheDocument();
  });

  it("should render the logo image", () => {
    renderWithStore();
    const logoImage = screen.getByAltText("imagotipo-Hound_Express");
    expect(logoImage).toBeInTheDocument();
  });

  it("should render the menu button", () => {
    renderWithStore();
    const menuButton = screen.getByAltText("menu-icon");
    expect(menuButton).toBeInTheDocument();
  });

  it("should render the close menu button", () => {
    renderWithStore();
    const closeButton = screen.getByAltText("x-icon");
    expect(closeButton).toBeInTheDocument();
  });

  it("should render the navigation links", () => {
    renderWithStore();
    const navLinks = [
      "Inicio",
      "Registro de Guías",
      "Estado General",
      "Lista de Guías",
      "🔍 Buscar Guías",
      "Historial de Guías",
    ];
    navLinks.forEach((linkText) => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
    });
  });

  it("should toogle the menu display when the menu button is clicked", () => {
    renderWithStore();
    const linksContainer = screen.getByText(/inicio/i).parentNode;
    const menuButton = screen.getByAltText("menu-icon");
    const closeButton = screen.getByAltText("x-icon");

    // Initially, the menu should be hidden
    expect(linksContainer).toHaveClass("hidde");

    // Click the menu button to show the menu
    fireEvent.click(menuButton);
    expect(linksContainer).not.toHaveClass("hidde");

    // Click the close button to hide the menu
    fireEvent.click(closeButton);
    expect(linksContainer).toHaveClass("hidde");
  });

  it("should render the header with fixed class when menuDisplay is true", () => {
    renderWithStore({ menuDisplay: true });
    const header = screen.getByRole("header");
    expect(header).toHaveClass("fixed");
  });

  it("should not have fixed class when menuDisplay is false", () => {
    renderWithStore({ menuDisplay: false });
    const header = screen.getByRole("header");
    expect(header).not.toHaveClass("fixed");
  });
});
