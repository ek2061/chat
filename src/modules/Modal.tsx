import { XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode, useEffect, useState } from "react";
import Portal from "./Portal";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  children,
  action,
}) => {
  const [removeDOM, setRemoveDOM] = useState(!open);

  useEffect(() => {
    if (open) {
      setRemoveDOM(false);
    } else {
      setRemoveDOM(true);
    }
  }, [open]);

  return removeDOM ? null : (
    <Portal>
      <div className="fixed left-0 top-0 z-[1000] h-full w-full bg-gray-500 opacity-70" />
      <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden">
        <div className="h-auto w-[90%] max-w-3xl overflow-auto rounded-md border-[1px] border-solid border-blue-500 bg-slate-300 px-6 py-4 text-left">
          <div className="flex items-center justify-between pb-3">
            <p className="text-2xl font-semibold">{title}</p>
            <XMarkIcon
              className="z-[1000] h-5 w-5 cursor-pointer hover:scale-125"
              onClick={onClose}
            />
          </div>
          <div className="my-5">{children}</div>
          <div className="flex justify-end space-x-2 pt-2">{action}</div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
