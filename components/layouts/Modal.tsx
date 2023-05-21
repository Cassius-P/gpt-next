import { useUI } from "@/contexts/UIContext";
import ReactPortal from "./ReactPortal";
import { auth } from "@/utils/firebase";
import Search from "@/components/utils/Search";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

function Modal({
  children
}: ModalProps) {
  const { displayModal } = useUI();

  const handleInsideClick = (e: React.MouseEvent) => {
    console.log("Auth", auth);
    e.stopPropagation();
  }


  const isSearch = () => {
    // @ts-ignore
    return children.length > 0 && children[3].type === Search;

  }


  return (
    <ReactPortal>

        <div className={`block relative z-20 ${displayModal ? "opacity-100 prevent-scroll" : "opacity-0 pointer-events-none"} transition-all ease-in-out duration-300 delay-100`}>
          {isSearch() && displayModal && children}
          {!isSearch() && (
              <>
                <div className={`fixed inset-0 ${displayModal ? "bg-black/50" : "bg-transparent"} transition-all ease-in-out duration-300 delay-100`} />


                <div className={`fixed inset-0 flex items-center justify-center ${displayModal ? "m-0" : "mt-24"} transition-all ease-in-out duration-300 delay-100`}>

                  <div className="shadow-2xl bg-white dark:bg-gray-800 dark:text-white rounded-lg transition-all ease-in-out duration-300 p-4 w-4/5 sm:w-3/5 lg:w-1/3 xl:w-1/4  2xl:1/5"
                       onClick={handleInsideClick}>
                    <div>
                      {children}
                    </div>
                  </div>

                </div>
              </>
              )}
        </div>
    </ReactPortal>
  )
}

export default Modal;