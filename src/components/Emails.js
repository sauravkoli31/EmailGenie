import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { carpetHasBeenPulled } from "../redux/emailId";
import Table from "react-bootstrap/Table";

export default function Emails() {
  const genieInfo = useSelector((state) => state.userInfo);
  const emailId = useSelector((state) => state.emailId);
  const dispatch = useDispatch();

  const [data, updateData] = useState([]);

  useEffect(() => {
    if (!emailId.datapulled) {
      testSend();
      console.log("Getting Messages");
    }

    async function fetchData() {
      var args = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + genieInfo.uInfo.userAccess_Token,
        },
      };

      var url = "http://localhost:5000/api/v1/EmailMessages";
      // const response = await fetch(url, args);
      // const json = await response.json();
      // updateData(json.data);

      fetch(url, args).then((response) => response.json())
      .then((jsonData) => updateData(jsonData));
      console.log(data);
    }
    fetchData();
  }, []);

  function testSend() {
    // console.log(!emailId.datapulled,(Object.keys(emailId?.data).length === genieInfo.userTotalEmail))
    console.log(emailId.datapulled);
    if (!emailId.datapulled) {
      var args = {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + genieInfo.uInfo.userAccess_Token,
        },
      };

      var url = "http://localhost:5000/api/v1/Emails";
      fetch(url, args).then(() => {
        dispatch(carpetHasBeenPulled());
      });
    } else {
      console.log(
        "In Local Storage",
        emailId.datapulled,
        genieInfo.userTotalEmail
      );
    }
  }

  return (
    <>
      {!!genieInfo.userIsLoggedIn ? (
        <div className="col-md-12 col-lg-12">
          <div className="card gx-5 p-3 m-3 glass more-blur">
            <p className="fs-5 fw-bold">Email Stats</p>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Root Domain</th>
                  <th>Count</th>
                </tr>
              </thead>
              {data ? (
                <>
                  <tbody>
                    {data.map((addr,addrKey) => (
                      <tr key={addr._id}>
                        <td>
                          <img src={"https://s2.googleusercontent.com/s2/favicons?sz=32&domain=" +addr.rootDomain }/>
                        </td>
                        <td>{addr.rootDomain}</td>
                        <td>{addr.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>{console.log('here',data)}</>
              )}
            </Table>
          </div>
        </div>
      ) : (<></>)}
    </>
  );
}
