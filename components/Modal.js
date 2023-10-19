import { createPortal } from "react-dom";

const Modal = ({ title, children, onClose }) => {
  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <dialog open className="modal">
        <h2>{title}</h2>
        {children}
      </dialog>
    </>,
    document.getElementById("modal")
  );
};

export default Modal;
