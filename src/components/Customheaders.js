import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { genieLogIn, genieLogOut } from "../redux/userinfo";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import config from "../config.json";
import { carpetCrashed } from "../redux/emailId";
function Customheaders() {
  const genieInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  function login(response) {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: response.accessToken }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    fetch("http://localhost:5000/api/v1/auth/google", options).then((r) => {
      const token = r.headers.get("x-auth-token");
      r.json().then((user) => {
        if (token) {
          dispatch(genieLogIn({ user, token }));
        }
      });
    });
  }

  function logout() {
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "authorization":"Bearer "+genieInfo.uInfo.userAccess_Token
      },
    };
    fetch("http://localhost:5000/logout", options).then(() => {
      dispatch(genieLogOut());
      dispatch(carpetCrashed());
    });
  }

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-light m-2 py-2"
        style={{
          borderRadius: "0.25rem",
          background: "rgba(255,255,255,0.5)",
          backdropFilter: "blur(0.25rem)",
        }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Email Genie
          </a>
          {!!genieInfo.userIsLoggedIn ? (
            <>
              <GoogleLogout
                clientId={process.env.REACT_APP_rci}
                buttonText="Signout"
                onLogoutSuccess={logout}
                className="glass"
              />
            </>
          ) : (
            <>
              <GoogleLogin
                clientId={process.env.REACT_APP_rci}
                buttonText="Login"
                scope={config.scope}
                onSuccess={login}
                isSignedIn={true}
                className="glass"
              />
            </>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Customheaders;
