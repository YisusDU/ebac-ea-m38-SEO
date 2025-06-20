import React from "react";
import { screen, render } from "@testing-library/react";
import Banner from "../Banner/index";
import { ThemeProvider } from "styled-components";
import Theme from "../../theme/index";

//We mock the imgs to avoid errors
jest.mock("../../assets/IMG/bannerCanva-HX.png", () => "bannerCanva-HX.png");
jest.mock("../../assets/IMG/bannerUS__HX.png", () => "bannerUS__HX.png");

describe("Banner component", () => {
  it("renders the images of the carrusel", () => {
    render(
      <ThemeProvider theme={Theme}>
        <Banner />
      </ThemeProvider>
    );
    expect(screen.getByAltText("bannerCanva-HX")).toBeInTheDocument();
    expect(screen.getByAltText("Banner-HX-logistics")).toBeInTheDocument();
  });
});
