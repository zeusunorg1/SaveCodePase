import * as React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { css } from "@emotion/react";
import "react-datepicker/dist/react-datepicker.css";
import { navigate } from "gatsby";
import jwt from "jsonwebtoken";

// styles
const pageStyles = {
  color: "#232129",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};

const headingStyles = {
  textAlign: "center",
  marginTop: 0,
  marginBottom: 30,
};

const formStyle = css`
  width: 100%;
`;

const labelStyle = css`
  padding-right: 10px;
`;

const titleStyle = css`
  font-size: 20px;
  text-decoration: underline;
  padding-right: 10px;
`;

const labelBlock = css`
  margin-bottom: 15px;
  display: block;
`;

const inputTextStyle = css`
  width: 100%;
`;

const submitStyle = css`
  text-align: center;

  input {
    font-size: 1.8em;
    background-color: #f4d03f;
  }
`;

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("/");
}

const vacunasOptions = [
  "Sinopharm Vacuna SARSCOV 2",
  "Sputnik V COVID19 Instituto Gamaleya",
  "AstraZeneca ChAdOx1 S recombinante",
  "Janssen Ad26 COV2 S", // De Janssen no estoy seguro necesito un token de muestra o una foto pero se que esta
  "Pfizer-BioNTech COVID-19",
  "COVISHIELD ChAdOx1nCoV COVID 19"
];

// markup
const IndexPage = () => {
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [nacimiento, setNacimiento] = useState(
    new Date(Date.parse("01/01/1990"))
  );

  const [qrBarrani, setQrBarrani] = useState(false);

  const [vacunasActivas, setVacunasActivas] = useState([
    true,
    true,
    false,
    false,
  ]);

  // Default data
  const [vacunas, setVacunas] = React.useState([
    {
      lugarAplicacion:
        "UNIDADES SANITARIAS MOVILES, VACUNACION Y TESTEO (USAM) - BARRACAS - COMUNA 4 - CABA",
      dosis: "Primera",
      fechaAplicacion: "09/13/2021",
      lote: "202108B1249",
      vacunaNombre: "Sinopharm Vacuna SARSCOV 2",
    },
    {
      lugarAplicacion:
        "UNIDADES SANITARIAS MOVILES, VACUNACION Y TESTEO (USAM) - BARRACAS - COMUNA 4 - CABA",
      dosis: "Segunda",
      fechaAplicacion: "10/21/2021",
      lote: "202109B1358",
      vacunaNombre: "Sinopharm Vacuna SARSCOV 2",
    },
    {
      lugarAplicacion:
        "UNIDADES SANITARIAS MOVILES, VACUNACION Y TESTEO (USAM) - BARRACAS - COMUNA 4 - CABA",
      dosis: "Tercera",
      fechaAplicacion: "12/20/2021",
      lote: "202109B1468",
      vacunaNombre: "Sinopharm Vacuna SARSCOV 2",
    },
    {
      lugarAplicacion:
        "UNIDADES SANITARIAS MOVILES, VACUNACION Y TESTEO (USAM) - BARRACAS - COMUNA 4 - CABA",
      dosis: "Cuarta",
      fechaAplicacion: "01/01/2022",
      lote: "202209C0578",
      vacunaNombre: "Sinopharm Vacuna SARSCOV 2",
    },
  ]);

  const setLugarAplicacion = React.useCallback(
    (lugarAplicacion, index) => {
      const vacunasNew = [...vacunas];
      vacunasNew[index].lugarAplicacion = lugarAplicacion;
      setVacunas(vacunasNew);
    },
    [vacunas]
  );

  const setFechaAplicacion = React.useCallback(
    (fechaAplicacion, index) => {
      const vacunasNew = [...vacunas];
      vacunasNew[index].fechaAplicacion = fechaAplicacion;
      setVacunas(vacunasNew);
    },
    [vacunas]
  );

  const setLote = React.useCallback(
    (lote, index) => {
      const vacunasNew = [...vacunas];
      vacunasNew[index].lote = lote;
      setVacunas(vacunasNew);
    },
    [vacunas]
  );

  const setVacunaNombre = React.useCallback(
    (vacunaNombre, index) => {
      const vacunasNew = [...vacunas];
      vacunasNew[index].vacunaNombre = vacunaNombre;
      setVacunas(vacunasNew);
    },
    [vacunas]
  );

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();

      const personaData = {
        nroDoc: dni,
        nombreApellido: apellido.toUpperCase() + ", " + nombre.toUpperCase(),
        fechaNacimiento: formatDate(nacimiento),
      };

      const aplicacionesData = [];
      vacunasActivas.forEach((active, index) => {
        if (active) {
          const vacunaData = vacunas[index];
          vacunaData.fechaAplicacion = formatDate(vacunaData.fechaAplicacion);
          aplicacionesData.push(vacunaData);
        }
      });

      const tokenData = {
        persona: JSON.stringify(personaData),
        aplicaciones: JSON.stringify(aplicacionesData),
        esquemaCompleto: 1,
        esquemaVacunacion: "Vacunación completa",
        bar: qrBarrani,
      };

      console.warn(tokenData);

      const newToken = jwt.sign(tokenData, "asuperprivatekeythatsnotvalid");

      navigate(
        `carnetCovid/v2/miArgentina/covid/carnet/validar/img?token=${newToken}`
      );
    },
    [dni, nombre, apellido, nacimiento, vacunas, vacunasActivas]
  );

  return (
    <main style={pageStyles}>
      <title>Pase Barranitario</title>
      <h1 style={headingStyles}>Pase Barranitario</h1>
      <p>Por favor ingrese sus datos para generar su pase 100% barrani</p>

      <input
        type="checkbox"
        defaultChecked={qrBarrani}
        onChange={() => setQrBarrani(!qrBarrani)}
      />
      <span css={labelStyle}>
        Usar QR barrani?
        <i>
          (si es barrani la URL del QR va a ser valida pero sospechosa, si no la
          URL es real pero va a dar a una pagina en blanco/invalida, todo
          normal.)
        </i>
      </span>

      <form css={formStyle} onSubmit={handleSubmit}>
        <label css={labelBlock}>
          <span css={labelStyle}>Nombre:</span>
          <input
            css={inputTextStyle}
            defaultValue=""
            type="text"
            onChange={(ev) => setNombre(ev.target.value)}
          />
        </label>
        <label css={labelBlock}>
          <span css={labelStyle}>Apellido:</span>
          <input
            css={inputTextStyle}
            defaultValue=""
            type="text"
            onChange={(ev) => setApellido(ev.target.value)}
          />
        </label>
        <label css={labelBlock}>
          <span css={labelStyle}>DNI:</span>
          <input
            css={inputTextStyle}
            defaultValue=""
            type="text"
            onChange={(ev) => setDni(ev.target.value)}
          />
        </label>
        <label css={labelBlock}>
          <span css={labelStyle}>Fecha de nacimiento:</span>
          <DatePicker
            selected={nacimiento}
            onChange={(date) => setNacimiento(date)}
            dateFormat="dd/MM/yyyy"
            showYearDropdown={true}
          />
        </label>

        {vacunas.map((vacuna, index) => {
          return (
            <>
            <label css={labelBlock}>
              <input
                type="checkbox"
                defaultChecked={vacunasActivas[index]}
                onChange={(ev) => {
                  const activasNuevas = [...vacunasActivas];
                  activasNuevas[index] = !vacunasActivas[index];
                  setVacunasActivas(activasNuevas);
                }}
              />
              <span css={titleStyle}>{vacuna.dosis} dosis</span>
            </label>
              
              {vacunasActivas[index] ? 
              <>
                <span css={labelStyle}>Lugar de aplicacion:</span>
                <textarea
                  css={inputTextStyle}
                  defaultValue={vacuna.lugarAplicacion}
                  type="text"
                  onChange={(ev) => setLugarAplicacion(ev.target.value, index)}
                />

                <span css={labelStyle}>Fecha de aplicacion:</span>
                <DatePicker
                  selected={new Date(Date.parse(vacuna.fechaAplicacion))}
                  onChange={(date) => setFechaAplicacion(date, index)}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown={true}
                />

                <span css={labelStyle}>Lote:</span>
                <textarea
                  css={inputTextStyle}
                  defaultValue={vacuna.lote}
                  type="text"
                  onChange={(ev) => setLote(ev.target.value, index)}
                />

                <span css={labelStyle}>Vacuna:</span>
                <select
                  value={vacuna.vacunaNombre}
                  onChange={(ev) => {
                    setVacunaNombre(ev.target.value, index);
                  }}
                  style={{ width: "300px", height: "24px" }}
                >
                  {vacunasOptions.map((n) => {
                    return <option value={n}>{n}</option>;
                  })}
                </select>
              </>
              : null}
            </>
          );
        })}

        <div css={submitStyle}>
          <input type="submit" value="Generar mi pase" />
        </div>
      </form>
    </main>
  );
};

export default IndexPage;
