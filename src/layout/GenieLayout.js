import React from "react";
import { useSelector } from "react-redux";

import Homepage from "../components/Homepage";
import ProfileDetails from "../components/ProfileDetails";
import Emails from "../components/Emails";

function GenieLayout() {
  const genieInfo = useSelector((state) => state.userInfo);

  return (
    <>
      {!!genieInfo.userIsLoggedIn ? (
        <>
          <ProfileDetails />
          <Emails/>
        </>
      ) : (
        <Homepage/>

      )}
    </>
  );
}

export default GenieLayout;
