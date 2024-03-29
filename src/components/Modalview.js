import React, {forwardRef, useImperativeHandle} from "react";
import ReactDOM from "react-dom";

const Modalview = forwardRef((props,ref) => {
  const [display, setDisplay] = React.useState(false);


  useImperativeHandle(ref, () => {
    return {
      openModal: () => open(),
      close: () => close()
    }
  });

  const open = () => {
    setDisplay(true)
  };

  const close = () => {
    setDisplay(false);
  };

  if (display) {
    return ReactDOM.createPortal(
      <div  className={"modal-wrapper"}>
        <div onClick={close} className={"modal-backdrop-custom"} />
          {props.children}
      </div>, document.getElementById("modal-root"))
  }

  return null;

});

export default Modalview