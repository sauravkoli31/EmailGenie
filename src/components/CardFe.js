import React from "react";
import { useSelector } from "react-redux";

function CardFe() {
  const genieInfo = useSelector((state) => state.userInfo);

  return (
    <div className="col-12" >
    <div className="card gx-5 p-3 m-3" >

          <img src={genieInfo.uInfo.userImageUrl} className="card-img-top" />
          <div className="card-body">
            <h5 className="card-title"></h5>

            <p className="fw-bold fs-3">Welcome {genieInfo.uInfo.userName}.</p>
            <p className="fs-5">{genieInfo.uInfo.userEmail}</p>
          </div>

    </div>
    </div>
  );
}

export default CardFe;
