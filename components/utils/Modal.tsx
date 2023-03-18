
import { useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { useUI } from "../UIContext";
import ReactPortal from "./ReactPortal";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({
  children,
  onClose
}: ModalProps) {
  const { displayModal, closeModal } = useUI();

  const handleInsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  }

  useEffect(() => {
    console.log('displayModal', displayModal)
  }, [displayModal])

  return (
    <ReactPortal>
      <div className={`block relative z-20 ${displayModal ? "opacity-100 prevent-scroll" : "opacity-0 pointer-events-none"} transition-all ease-in-out duration-300 delay-100`}>
        <div className={`fixed inset-0 ${displayModal ? "bg-black/50" : "bg-transparent"} transition-all ease-in-out duration-300 delay-100`} />
        
        
          <div className={`fixed inset-0 flex items-center justify-center ${displayModal ? "m-0" : "mt-24"} transition-all ease-in-out duration-300 delay-100`}>
            <div className="shadow-2xl bg-white rounded-lg transition-all ease-in-out duration-300 p-4 w-4/5 sm:w-3/5 lg:w-1/3 xl:w-1/4  2xl:1/5"
              onClick={handleInsideClick}>
              <div>
                {children}
              </div>
            </div>
          </div>
        
      </div>
    </ReactPortal>
  )
}

export default Modal;