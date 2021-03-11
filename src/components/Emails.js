import { React, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { carpetHasBeenPulled } from "../redux/emailId";
import { Container, Modal, Card, Row, Col, Button } from "react-bootstrap";
import Modalview from "./Modalview";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

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
    },
  ];

  const open = (id) => {
    console.log(modalRef.current[id], id);
    modalRef.current[id].openModal();
  };

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
      fetch(url, args)
        .then((response) => response.json())
        .then((jsonData) => {
          updateData(jsonData.allData);
          console.log(jsonData);
          if ( jsonData.mainCount < genieInfo.userTotalEmail ) {
            console.log('evaluated true',jsonData.mainCount,genieInfo.userTotalEmail);
            setTimeout(fetchData, 5000);
          }
        });
    }
    fetchData();
  }, []);

  function testSend() {
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
                    size="lg"
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
