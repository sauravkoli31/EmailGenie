import React from "react";
import { useSelector } from "react-redux";

import Homepage from "../components/Homepage";
import CardFe from "../components/CardFe";
import TotalEmails from "../components/TotalEmails";
import Emails from "../components/Emails";

function GenieLayout() {
  const genieInfo = useSelector((state) => state.userInfo);

  return (
    <>
      {!!genieInfo.userIsLoggedIn ? (
        <>
          <CardFe />
          <TotalEmails />
          <Emails/>
        </>
      ) : (
        <Homepage/>

      )}
    </>
  );
}

export default GenieLayout;
