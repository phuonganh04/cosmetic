import { UserOutlined } from "@ant-design/icons";
import { Popover, Typography } from "antd";
import { FC } from "react";
import { useAuth } from "../../../authentication/hooks";
import { PopupAction } from "./popup-action/popup-action";
import styles from "./user-on-header.module.scss";

const { Text } = Typography;

export const UserOnHeader: FC = () => {
  const {currentUser} = useAuth();
  return (
    <>
      <Popover content={PopupAction}>
        <div className={styles["user"]}>
          <div className={styles['user--image']}>
            <UserOutlined />
          </div>
          <Text>{currentUser?.name}</Text>
        </div>
      </Popover>
    </>
  )
}
