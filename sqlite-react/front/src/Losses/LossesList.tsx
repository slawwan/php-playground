import React, { FC, useContext } from "react";
import { Id } from "src/Utils/types";
import { LossEntity } from "src/Api";
import { Button, CurrencyLabel } from "@skbkontur/react-ui";
import { ReferencesContext } from "src/App/ReferencesContext";
import * as styles from "src/Losses/LossesList.less";

export interface LossesListProps {
  items: LossEntity[];
  onDelete: (id: Id) => void;
  onEdit: (id: Id) => void;
}
export const LossesList: FC<LossesListProps> = (props) => {
  const references = useContext(ReferencesContext);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>№</th>
          <th>Время регистрации повреждения</th>
          <th>Филиал</th>
          <th>Тепловой узел</th>
          <th>Утечка, т/ч</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.items.map((x, i) => {
          const heatingSubstation = references.heatingSubstationMap[x.heating_substation_id];
          const branchOffice = references.branchOfficesMap[heatingSubstation.branchOfficeId];
          return (
            <tr key={x.id} onClick={() => props.onEdit(x.id)}>
              <td>{i + 1}</td>
              <td>{x.datetime}</td>
              <td>{branchOffice.name}</td>
              <td>{heatingSubstation.name}</td>
              <td>
                <CurrencyLabel value={x.amount} fractionDigits={15} hideTrailingZeros />
              </td>
              <td>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onDelete(x.id);
                  }}
                >
                  X
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
