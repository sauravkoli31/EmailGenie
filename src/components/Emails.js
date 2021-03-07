import { React,  useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {carpetCrashed,carpetHasBeenPulled} from "../redux/emailId"

export default function Emails() {
  const genieInfo = useSelector((state) => state.userInfo);
  const emailId = useSelector((state) => state.emailId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!emailId.datapulled){
      testSend();
      console.log("Getting Messages");
    }
  }, []);

  function testSend() {
    // console.log((!emailId.datapulled),(Object.keys(emailId?.data).length === genieInfo.userTotalEmail))
    if (!emailId.datapulled){
      var args = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "authorization": "Bearer "+genieInfo.uInfo.userAccess_Token
        },
      };
  
      var url = "http://localhost:5000/api/v1/Emails";
      fetch(url, args)
        .then(() => {
          dispatch(carpetHasBeenPulled());
        });
    }
    else {
      console.log('In Local Storage',emailId.datapulled,genieInfo.userTotalEmail);
    }
  }

  return (
    <>
      {!!genieInfo.userIsLoggedIn ? (
        <div className="col-md-12 col-lg-3">
          <div className="card gx-5 p-3 m-3 glass">
            <p className="fs-5 fw-bold">Email Stats</p>
            <button className="badge bg-primary fs-5" onClick={testSend}>Click Me</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
