Para comenzar con las pruebas será necesario intalar y configurar algunas cosas:
    -Al crear una app de react con el comando create-react-app, ya se intalan algunas librearias de pruebas, como
    testing-library
    -Había eliminado una archivo por error anteriormente, pero lo voy a copiar en el proyecto, es setupTest.js
        -Dicho  archivo va dentro de src
        Dicho archivo lo he renombrado con la extension .ts
    -Necesitamos instalar el tipado para jest con el comando :  npm i --save-dev @types/jest
        -Necesitamos agregar una linea a nuestro archivo tsconfig.json, la linea es : "types": ["jest"]
     

Vamos a crear la carpeta __tests__ primeramente dentro de components y ver que nos va pidiendo la consola
    --Comenzamos probando un componente sencillo, el banner, creamos el archivo de pruebas Banner.test.tsx
    --Tenemos esta pequeña prueba con estos imports

        import React from "react";
        import { screen, render } from "@testing-library/react";
        import Banner from "../Banner/index";

        //We mock the imgs to avoid errors
        jest.mock("../../assets/IMG/bannerCanva-HX.png", () => "bannerCanva-HX.png");
        jest.mock("../../assets/IMG/bannerUS__HX.png", () => "bannerUS__HX.png");

        describe("Banner component", () => {
        it("renders the images of the carrusel", () => {
            render(<Banner />);
            expect(screen.getByAltText("bannerCanva-HX")).toBeInTheDocument();
            expect(screen.getByAltText("Banner-HX-logistics")).toBeInTheDocument();
        });
        });
    --Y nos da este error:  
         FAIL  src/components/__tests__/Banner.test.tsx
  Banner component
    × renderiza las imágenes del carrusel (59 ms)

  ● Banner component › renderiza las imágenes del carrusel

    TypeError: Cannot read properties of undefined (reading 'secondaryColor')

    --Recordemos que nuestra app esta envuelta en un ThemeProvider, entonces, devemos importar ThemeProvider y envolver nuetro componente
        e importar Theme desde nuestro theme/index y pasarselo como prop

--Para este punto, ya pasó la primera prueba, pero Necesitamos hacer un coverage:
     --He añadido esta linea al package.json para hacer el coverage y ha funcionado de maravilla, cortesia de EBAC
        "test:coverage": "react-scripts test --coverage",
    --Noté que se quedaba en modo watchAll con el comando npm test, y he añadido el siguiente comando desde Stackoverflow para que
    la prueba se ejecute una sola vez:
        "test": "react-scripts test --watchAll=false"
    -Además modifique el script anterior de test para que quede como testAuto con el watchAll true


