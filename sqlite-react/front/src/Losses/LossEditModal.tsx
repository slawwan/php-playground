import { Id } from "src/Utils/types";
import { Api, LossEntity, LossSaveData } from "src/Api";
import React, { FC } from "react";
import { LossModal, LossModalResultValue, LossModalSourceValue } from "src/Losses/LossModal";

interface LossEditModalProps {
  id: Id;
  onSave: (value: LossEntity) => void;
  onCancel: () => void;
}

export const LossEditModal: FC<LossEditModalProps> = (props) => {
  const load = async (): Promise<LossModalSourceValue> => {
    const entity = await Api.getLoss(props.id);
    return { heatingSubstationId: entity.heating_substation_id, amount: entity.amount, datetime: entity.datetime };
  };
  const handleSave = async (value: LossModalResultValue): Promise<void> => {
    const data: LossSaveData = { heating_substation_id: value.heatingSubstationId, amount: value.amount };
    const entity = await Api.saveLoss(data, props.id);
    props.onSave(entity);
  };
  return <LossModal loadValue={load} title={"Редактирование утечки"} onSave={handleSave} onCancel={props.onCancel} />;
};
