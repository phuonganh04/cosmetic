import { FC, ReactNode } from "react";
import styles from "./admin-content.module.scss";

interface AdminContentProps {
  children: ReactNode;
}

export const AdminContent: FC<AdminContentProps> = ({children}) => {
  return (
    <div className={styles["admin-content"]}>{children}</div>
  )
}
