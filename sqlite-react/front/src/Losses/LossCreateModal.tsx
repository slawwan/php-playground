import { Api, LossEntity, LossSaveData } from "src/Api";
import React, { FC } from "react";
import { LossModal, LossModalResultValue, LossModalSourceValue } from "src/Losses/LossModal";

interface LossCreateModalProps {
  onSave: (value: LossEntity) => void;
  onCancel: () => void;
}

const emptyLoss: LossModalSourceValue = {
  heatingSubstationId: null,
  amount: null,
  datetime: null,
};

export const LossCreateModal: FC<LossCreateModalProps> = (props) => {
  const handleSave = async (value: LossModalResultValue): Promise<void> => {
    const data: LossSaveData = { heating_substation_id: value.heatingSubstationId, amount: value.amount };
    const entity = await Api.saveLoss(data);
    props.onSave(entity);
  };
  return (
    <LossModal
      loadValue={async () => emptyLoss}
      title={"Новавя утечка"}
      onSave={handleSave}
      onCancel={props.onCancel}
    />
  );
};
