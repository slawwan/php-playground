import React, { FC, ReactNode } from "react";
import * as styles from "src/Components/FormItem.less";

interface FormItemProps {
  title: ReactNode;
  children: ReactNode;
}

export const FormItem: FC<FormItemProps> = (props) => (
  <div className={styles.item}>
    <div className={styles.title}>{props.title}</div>
    <div>{props.children}</div>
  </div>
);
