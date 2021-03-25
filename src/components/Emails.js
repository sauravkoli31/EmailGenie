import { React, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { carpetHasBeenPulled } from "../redux/emailId";
import { Container, Modal, Card, Row, Col, Button } from "react-bootstrap";
import Modalview from "./Modalview";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

export default function Emails() {
  //Redux
  const genieInfo = useSelector((state) => state.userInfo);
  const emailId = useSelector((state) => state.emailId);
  const dispatch = useDispatch();

  //Email Data
  const [data, updateData] = useState([]);

  //For Modal
  const modalRef = useRef(new Array());

  const columns = [
    {
      dataField: "recipient",
      text: "Email From",
    },
    {
      dataField: "count",
      text: "Number of Emails",
      headerStyle: (colum, colIndex) => {
        return { width: "18%", textAlign: "center" };
      },
    },
    {
      dataField: "unsubscribe",
      text: "Unsub Link",
      formatter: (cell, row, rowIndex, extraData) => (
        <>
          <div>
            {Array.isArray(row.unsubscribe) && row.unsubscribe.length > 0 ? (
              <a href="/unsubLinks" data-unsublinks={row.unsubscribe}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M18.5 13c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm2 4h-4v-1h4v1zm-6.95 0c-.02-.17-.05-.33-.05-.5 0-2.76 2.24-5 5-5 .92 0 1.76.26 2.5.69V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h8.55zM12 10.5L5 7V5l7 3.5L19 5v2l-7 3.5z" />
                </svg>
              </a>
            ) : (
              <></>
            )}
          </div>
        </>
      ),
      headerStyle: (colum, colIndex) => {
        return { width: "20%", textAlign: "center" };
      },
      classes: "smallll",
    },
  ];

  const open = (id) => {
    console.log(modalRef.current[id], id);
    modalRef.current[id].openModal();
  };

  useEffect(() => {
    if (!emailId.datapulled) {
      fetchAllEmails();
      console.log("Getting Messages");
    }

    function fetchData() {
      console.log(genieInfo.userTotalEmail);
      var args = {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + genieInfo.uInfo.userAccess_Token,
        },
      };

      var url = "http://localhost:5000/api/v1/EmailMessages";
      fetch(url, args)
        .then((response) => response.json())
        .then((jsonData) => {
          updateData(jsonData.allData);
          console.log(jsonData);
          if (jsonData.mainCount < genieInfo.userTotalEmail) {
            console.log(
              "evaluated true",
              jsonData.mainCount,
              genieInfo.userTotalEmail
            );
            setTimeout(fetchData, 5000);
          } else
            console.log(
              "evaluated false",
              jsonData.mainCount,
              genieInfo.userTotalEmail
            );
        });
    }

    function fetchAllEmails() {
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

    // setTimeout(fetchData, 1000);
    fetchData();
  }, [genieInfo.userTotalEmail]);

  return (
    <Container>
      <Row>
        {data ? (
          <>
            {data.map((addr, addrKey) => (
              <Col lg={12} xl={4} key={addrKey} className="fadeInDown">
                <Card
                  className="m-2 thoushallclickthis more-blur"
                  key={addrKey}
                  onClick={() => open(addrKey)}
                >
                  <Card.Body className="m-2 d-flex justify-content-between ">
                    <div className="fadeIn first">
                      <img
                        src={
                          "https://s2.googleusercontent.com/s2/favicons?sz=32&domain=" +
                          addr.rootDomain
                        }
                        style={{ borderRadius: "4px" }}
                        className="mr-3"
                        loading="lazy"
                        width={"32px"}
                        height={"32px"}
                      />
                      &nbsp; &nbsp;
                      <span className="fw-bold">{addr.rootDomain}</span>
                    </div>
                    <span
                      className="badge bg-primary fs-5 fadeIn second"
                      style={{ width: "max-content" }}
                    >
                      {addr.totalCount}
                    </span>
                  </Card.Body>
                </Card>

                <Modalview
                  ref={(element) => (modalRef.current[addrKey] = element)}
                  key={"asdasd"}
                >
                  <Modal
                    show="true"
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header>
                      <Container fluid>
                        <Modal.Title
                          id="contained-modal-title-vcenter"
                          fluid
                          className="d-flex justify-content-between"
                        >
                          <div className="fadeIn first">
                            <img
                              src={
                                "https://s2.googleusercontent.com/s2/favicons?sz=32&domain=" +
                                addr.rootDomain
                              }
                              style={{ borderRadius: "4px" }}
                              className="mr-3"
                              loading="lazy"
                            />
                            &nbsp; &nbsp;
                            <span className="fw-bold">{addr.rootDomain}</span>
                          </div>
                          <span
                            className="badge bg-primary fs-5 fadeIn second"
                            style={{ width: "max-content" }}
                          >
                            {addr.totalCount}
                          </span>
                        </Modal.Title>
                      </Container>
                    </Modal.Header>
                    <Modal.Body className="fadeIn third">
                      <BootstrapTable
                        keyField="recipient"
                        data={addr.emailsFromSubDomain}
                        columns={columns}
                        pagination={paginationFactory()}
                        striped
                        hover
                        condensed
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button onClick={() => modalRef.current[addrKey].close()}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Modalview>
              </Col>
            ))}
          </>
        ) : (
          <></>
        )}
      </Row>
    </Container>
  );
}
