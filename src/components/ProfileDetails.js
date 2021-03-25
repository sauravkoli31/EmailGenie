import { React, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { genieEmailpulled } from "../redux/userinfo";

function ProfileDetails() {
  const genieInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(genieInfo.userIsLoggedIn);
    if (genieInfo.userIsLoggedIn) {
      getStat();
      console.log("First Login. Creating local storage data.");
    }
  }, []);

  function getStat() {
    var args = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + genieInfo.uInfo.userAccess_Token,
      },
    };

    var url = "http://localhost:5000/api/v0/totalEmails";
    fetch(url, args)
      .then((res) => res.json())
      .then((data) => {
        if (genieInfo.userTotalEmail !== data.messagesTotal) {
          console.log("Creating local store.", genieInfo.userTotalEmail);
          dispatch(genieEmailpulled(data.messagesTotal));
        }
      });
  }

  return (
    <div className="col-12">
      <div className="card gx-5 p-3 m-2 glass">
        <img src={genieInfo.uInfo.userImageUrl} className="card-img-top" />
        <div className="card-body">
          <h5 className="card-title"></h5>

          <p className="fw-bold fs-3">Welcome {genieInfo.uInfo.userName}.</p>
          <p className="fs-5">{genieInfo.uInfo.userEmail}</p>
          <span
            className="badge bg-primary fs-5"
            style={{ width: "max-content", margin: "auto" }}
          >
            {genieInfo.userTotalEmail || 0}
          </span>
          <p className="fs-5 fw-bold">Total Emails</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
