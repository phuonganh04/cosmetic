import { FC, ReactNode } from "react";
import styles from "./container.module.scss";
import classnames from "classnames";

interface ContainerProps {
  children: ReactNode;
  type?: "small" | "half" | "big" | "default";
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, type = "default", className = "" }) => (
  <div className={classnames(styles[`${type}-container`], className)}>
    {children}
  </div>
)

export default Container;
