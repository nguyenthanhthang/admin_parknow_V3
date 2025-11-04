import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "store/modalReducer";
import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";
// import { closeModal } from "store/modalReducer";

const DialogDelete = (props) => {
  const { open, modalType } = props;
  const dispatch = useDispatch();

  const handleConfirm = () => {
    Swal.fire({
      title: "Xác nhận?",
      text: "Bạn có chắc chắn muốn xóa!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Hủy",
      confirmButtonText: "Xác nhận!",
      customClass: {
        container: "swal-custom", // Apply the custom class to the Swal container
      },
    }).then((result) => {
      // Handle SweetAlert2 dialog result
      if (result.isConfirmed) {
        Swal.fire({
          title: "Thành công!",
          text: "Thực hiện xóa thành công.",
          icon: "success",
          customClass: {
            container: "swal-custom", // Apply the custom class to the Swal container
          },
        });
        dispatch(closeModal(modalType));
      }
    });
  };

  useEffect(() => {
    if (open) {
      handleConfirm();
    }
  }, [open]);

  return null;
};

export default DialogDelete;
