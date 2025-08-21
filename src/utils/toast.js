import { toast } from "react-toastify";

export const appToast = (message, time = 5000) => {
  toast(message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};

export const successToast = (message, time = 5000) => {
  toast.success(message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};

export const infoToast = (message, time = 5000) => {
  toast.info(message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};

export const warningToast = (message, time = 5000) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};

export const errorToast = (message, time = 5000) => {
  toast.error(message, {
    position: "top-center",
    autoClose: time,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
  });
};
