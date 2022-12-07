/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "../../authentication/hooks";
import axiosClient from "../../common-component/apis";
import { notificationError, notificationSuccess } from "../../common-component/notification";
import { UpdateUserInformationForm } from "../../features/admin/user-management";

export const UpdateUserInformation = () => {
  const authContext = useAuth();
  const currentUser = authContext.currentUser;

  const handleSubmitEdit = async (value: any) => {
    axiosClient.put(`users/${currentUser.id}`, value).then(() => {
      notificationSuccess("Dữ liệu đã được cập nhật")
      axiosClient.get("/me").then(response => authContext.setCurrentUser(response?.data || currentUser))
    }).catch((error) => notificationError(error.message))
  }

  return (
    <div className="my-5">
      <h2 className="mb-5 font-bold text-base uppercase">Chỉnh sửa thông tin cá nhân</h2>

      <UpdateUserInformationForm {...{
        documentEditing: currentUser,
        visibleDetail: true,
        handleSubmitEdit,
      }} />
    </div>
  )
}

export default UpdateUserInformation;
