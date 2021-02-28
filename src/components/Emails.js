import { React,  useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import {carpetCrashed,carpetHasBeenPulled} from "../redux/emailId"

export default function Emails() {
  const genieInfo = useSelector((state) => state.userInfo);
  const emailId = useSelector((state) => state.emailId);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!emailId.datapulled || !(Object.keys(emailId?.data).length === genieInfo.userTotalEmail)){
  //     testSend();
  //     console.log("Getting Messages");
  //   }
  // }, []);

  function testSend() {
    if (!emailId.datapulled || !(Object.keys(emailId?.data).length === genieInfo.userTotalEmail)){
      var raw = JSON.stringify(genieInfo.uInfo);
      var args = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      };
  
      var url = "http://localhost:5000/api/v1/Emails";
      fetch(url, args)
        .then((res) => res.json())
        .then((data) => {
          dispatch(carpetHasBeenPulled(data));
        });
    }
    else {
      console.log('In Local Storage',!emailId.datapulled,Object.keys(emailId?.data).length,genieInfo.userTotalEmail);
      console.log(emailId.data);
    }
  }

  function Messages() {
      var only = emailId.data.map(obje => {return obje.id});
      console.log(only);
      var raw = JSON.stringify(genieInfo.uInfo);
      console.log(raw)
      var args = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: raw,
      };
  
      var url = "http://localhost:5000/api/v1/EmailMessages";
      fetch(url, args)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
  }

  return (
    <>
      {!!genieInfo.userIsLoggedIn ? (
        <div className="col-md-12 col-lg-3">
          <div className="card gx-5 p-3 m-3">
            <p className="fs-5 fw-bold">Email Stats</p>
            <button className="badge bg-primary fs-5" onClick={testSend}>Click Me</button>
            <button className="badge bg-primary fs-5" onClick={Messages}>Messages</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
