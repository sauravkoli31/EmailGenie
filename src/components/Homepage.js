import React from "react";
import emailBanner from "../assets/2710476-01.png";

function Homepage() {
  return (
    <div className="container p-2 glass">
      <div className="row">
        <div className="col-lg-6 my-auto">
          <div className="my-3">
          <h2 className="display-3 ">Email Genie</h2>
          <div style={{fontWeight: 800, fontSize: "21px"}}>Take control of your mailbox</div>
          </div>
        </div>
        <div className="col-lg-6 my-auto">
          <img src={emailBanner} style={{ maxWidth: "inherit" }} alt="Business vector created by pikisuperstar - www.freepik.com https://www.freepik.com/vectors/business" />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
