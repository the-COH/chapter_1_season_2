import React, { createContext, useContext } from "react";
import { toast, TypeOptions, Id } from "react-toastify";
import { text } from "stream/consumers";
import ToastContent from "components/ToastContent";

const useToast = () => {
  const success = (text: string) => {
    toast.success(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const error = (text: string) => {
    toast.error(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const loading = (text: string) => {
    return toast.loading(text, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const update = (
    id: Id,
    text: string,
    type: TypeOptions | null | undefined
  ) => {
    toast.update(id, {
      render: text,
      type: type,
      isLoading: false,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const txSuccess = (id: Id, text: string, hash?: string) => {
    toast.update(id, {
      render: <ToastContent text={text} hash={hash} />,
      type: "success",
      isLoading: false,
      position: "top-right",
      autoClose: 50000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return { success, error, loading, update, txSuccess };
};

export default useToast;
