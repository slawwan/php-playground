import React, { FC, useState } from "react";
import { Id } from "src/Utils/types";
import { Api, LossEntity } from "src/Api";
import { useMount } from "src/Utils/hooks";
import { Button } from "@skbkontur/react-ui";
import { LossCreateModal } from "src/Losses/LossCreateModal";
import { LossEditModal } from "src/Losses/LossEditModal";
import { LossesList } from "src/Losses/LossesList";
import * as styles from "src/Losses/Losses.less";

export const Losses: FC = () => {
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [editingLossId, setEditingLossId] = useState<Id | null>(null);
  const [losses, setLosses] = useState<LossEntity[]>([]);
  useMount(async () => {
    const [losses] = await Promise.all([Api.selectLosses()]);
    setLosses(losses);
  });
  const handleCreate = (value: LossEntity): void => {
    setLosses([value, ...losses]);
    setCreateModalVisible(false);
  };
  const handleDelete = async (id: Id): Promise<void> => {
    await Api.deleteLoss(id);
    setLosses(losses.filter((x) => x.id !== id));
  };
  const handleEdit = async (value: LossEntity): Promise<void> => {
    setLosses(losses.map((x) => (x.id == value.id ? value : x)));
    setEditingLossId(null);
  };
  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>Утечки на тепловых узлах</div>
        <Button use={"primary"} size={"large"} onClick={() => setCreateModalVisible(true)}>
          Зафиксировать утечку
        </Button>
      </div>
      <LossesList items={losses} onDelete={handleDelete} onEdit={setEditingLossId} />
      {isCreateModalVisible && <LossCreateModal onCancel={() => setCreateModalVisible(false)} onSave={handleCreate} />}
      {editingLossId && (
        <LossEditModal id={editingLossId} onCancel={() => setEditingLossId(null)} onSave={handleEdit} />
      )}
    </div>
  );
};
