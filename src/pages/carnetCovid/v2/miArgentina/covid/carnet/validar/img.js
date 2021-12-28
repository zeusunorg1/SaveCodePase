import * as React from "react";
import jwt from "jsonwebtoken";
import * as css from "./img.module.css";
import { useQueryParam, StringParam } from "use-query-params";
import QRCode from "qrcode";

import msalImg from "../../../../../../../images/escucho_msal.jpg";
import paseImg from "../../../../../../../images/pase.png";
import vacunaImg from "../../../../../../../images/vacuna.png";

export const getHostName = () => {
  if (typeof window !== 'undefined') {
    return window?.location?.hostname || document?.location?.hostname;
  }
}

function Pase(props) {
  const { persona, esquema, qr } = props;

  return (
    <div className={css.paseContainer}>
      <img src={paseImg} className={css.paseImg}></img>
      <img src={qr} className={css.paseQr} />
      <div className={`${css.paseTexto} ${css.nombre}`}>
        {persona.nombreApellido}
      </div>
      <div className={`${css.paseTexto} ${css.dni}`}>{persona.nroDoc}</div>
      <div className={`${css.paseTexto} ${css.nacimiento}`}>
        {persona.fechaNacimiento}
      </div>
      <div className={`${css.paseTexto} ${css.esquema}`}>{esquema}</div>
    </div>
  );
}

function Vacuna(props) {
  const { aplicacion, qr } = props;

  return (
    <div className={css.paseContainer}>
      <img src={vacunaImg} className={css.vacunaImg}></img>
      <img src={qr} className={css.vacunaQr} />
      <div className={`${css.vacunaTexto} ${css.vacunaNombre}`}>
        {aplicacion.vacunaNombre}
      </div>
      <div className={`${css.vacunaTexto} ${css.lote}`}>{aplicacion.lote}</div>
      <div className={`${css.vacunaTexto} ${css.dosis}`}>
        {aplicacion.dosis}
      </div>
      <div className={`${css.vacunaTexto} ${css.fechaAplicacion}`}>
        {aplicacion.fechaAplicacion}
      </div>
      <div className={`${css.vacunaTexto} ${css.lugarAplicacion}`}>
        {aplicacion.lugarAplicacion}
      </div>
    </div>
  );
}

export default function PasePage() {
  const [token] = useQueryParam("token", StringParam);
  const [qr, setQr] = React.useState("");
  if(token){
    var decoded = jwt.verify(token, "asuperprivatekeythatsnotvalid");
  }else{
    return (<span>Error</span>)
  }

  React.useEffect(() => {
    QRCode.toDataURL(`${decoded.bar === true ? getHostName() : "https://apisalud.msal.gob.ar"}/carnetCovid/v2/miArgentina/covid/carnet/validar/img?token=${token}`)
      .then(setQr)
      .catch((err) => {
        console.error(err);
      });
  }, [token]);

  const persona = JSON.parse(decoded.persona);
  const aplicaciones = JSON.parse(decoded.aplicaciones);

  return (
    <>
      <br />
      <br />

      <div width="100%" style={{ textAlign: "center" }}>
        <img src={msalImg} align="center;" width="200px;" />
      </div>

      <p align="justify">
        El Ministerio de Salud de la Nación de la República Argentina extiende
        el presente, conforme el artículo 16 de la Ley 27.491, con los datos
        sobre el estado de vacunación contra el Covid 19, que identifican a la
        persona vacunada, el producto, e indican la fecha, la dosis, el lote y
        el establecimiento de aplicación entre otra información, consignada por
        la Jurisdicción Nacional, Provincial y/o del Gobierno de la Ciudad
        Autónoma de Buenos Aires, responsable de la aplicación de la vacuna en
        el Registro Federal de Vacunación Nominalizado.{" "}
        <a href="https://www.argentina.gob.ar/miargentina/servicios/vacuna_covid">
          Más información
        </a>
      </p>
      <p align="justify">
        This document has been issued by the National Ministry of Health of the
        Argentine Republic in accordance with Section 16, Law No. 27491. It
        contains data on COVID-19 vaccination status, identifying the person
        vaccinated, the vaccine administered, as well as the date, doses, batch
        and vaccination centre, in addition to other details reported on the
        Federal Vaccination Roster by the Federal, Provincial and/or Buenos
        Aires city government authority responsible for vaccine administration.{" "}
        <a href="https://www.argentina.gob.ar/miargentina/servicios/vaccine_covid">
          More information
        </a>
      </p>

      <div
        width="100%"
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Pase persona={persona} esquema={decoded.esquemaVacunacion} qr={qr} />
        <br></br>

        {aplicaciones.map((aplicacion, index) => {
          return (
            <React.Fragment key={"vacuna-" + index}>
              <Vacuna aplicacion={aplicacion} qr={qr} />
              <br></br>
            </React.Fragment>
          );
        })}
        <br></br>
        <br></br>
      </div>
    </>
  );
}
