import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { genieLogIn, genieLogOut } from "../redux/userinfo";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import config from "../config.json";
import { carpetCrashed } from "../redux/emailId";
function Customheaders() {
  const genieInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="https://marketingland.com/wp-content/ml-loads/2015/12/email_ss_1920.png"
              width="30px"
            />
            Email Genie
          </a>
          {!!genieInfo.userIsLoggedIn ? (
            <>
              <GoogleLogout
                clientId={process.env.REACT_APP_rci}
                buttonText="Signout"
                onLogoutSuccess={() => {dispatch(genieLogOut());dispatch(carpetCrashed())}}
              />
            </>
          ) : (
            <>
              <GoogleLogin
                clientId={process.env.REACT_APP_rci}
                buttonText="Login"
                scope={config.scope}
                onSuccess={(response) => dispatch(genieLogIn(response))}
                isSignedIn={true}
              />
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Customheaders;
