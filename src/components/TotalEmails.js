import {React,useEffect} from "react";
import { useDispatch,useSelector } from "react-redux";
import { genieEmailpulled } from "../redux/userinfo"


export default function TotalEmails() {
    const genieInfo = useSelector((state) => state.userInfo);
    const dispatch = useDispatch();

    useEffect(() => {
      console.log(genieInfo.userIsLoggedIn)
      if (genieInfo.userIsLoggedIn) {
        getStat();
        console.log('First Login. Creating local storage data.')
      }
    },[]);
  
    function getStat() {
      var raw = JSON.stringify(genieInfo.uInfo);
      var args = {
        method: "POST",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: raw,
      };
  
      var url = "http://localhost:5000/api/v1/totalEmails";
      fetch(url, args)
      .then(res => res.json()).then(data => {
        if (genieInfo.userTotalEmail !== data.messagesTotal){
          console.log('Creating local store.',genieInfo.userTotalEmail);
        dispatch(genieEmailpulled(data.messagesTotal));}
      });
    }
    
    return (
        <>
        {!!genieInfo.userIsLoggedIn ? (
        <div className="col-md-12 col-lg-3">
        <div className="card gx-5 p-3 m-3">
              <span className="badge bg-primary fs-5" style={{width:"max-content",margin:"auto"}}>{genieInfo.userTotalEmail || ''}</span>
            <p className="fs-5 fw-bold">Total Emails</p>
            </div>
            </div>
        ):(<></>)}
        </>
    )
}