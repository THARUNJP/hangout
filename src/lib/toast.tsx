import toast from "react-hot-toast";
import Swal from "sweetalert2";

// ---- 1️ Base toast mixin ----
const baseToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

// ---- 2️ Simple toast ----
export const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  baseToast.fire({
    icon: type,
    title: message,
  });
};

// ---- 3️ Confirm modal (OK / Cancel) ----
export const showConfirm = async (
  message: string,
  confirmText = "OK",
  cancelText = "Cancel",
  icon: "warning" | "question" | "info" = "warning"
): Promise<boolean> => {
  const result = await Swal.fire({
    title: message,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};

// react hot toast
export const showHotToast = (
  message: string,
  type: "success" | "error" | "loading" | "custom" = "success"
) => {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;
    case "loading":
      toast.loading(message);
      break;
    default:
      toast(message);
  }
};
