import React, { FC, useState } from "react";
import { Api } from "src/Api";
import { groupBy, toObject } from "src/Utils/utils";
import { useMount } from "src/Utils/hooks";
import { BranchOffice, HeatingSubstation, References, ReferencesContext } from "src/App/ReferencesContext";
import { Losses } from "src/Losses/Losses";
import * as styles from "src/App/App.less";

async function loadReferences() {
  const [branchOfficeEntities, heatingSubstationEntities] = await Promise.all([
    Api.selectBranchOffices(),
    Api.selectHeatingSubstations(),
  ]);
  const branchOffices = branchOfficeEntities.map<BranchOffice>((x) => ({ id: x.id, name: x.name }));
  const heatingSubstations = heatingSubstationEntities.map<HeatingSubstation>((x) => ({
    id: x.id,
    name: x.name,
    branchOfficeId: x.branch_office_id,
  }));
  const references: References = {
    branchOffices: branchOffices,
    branchOfficesMap: toObject(branchOffices, (x) => x.id),
    heatingSubstationMap: toObject(heatingSubstations, (x) => x.id),
    heatingSubstationGroupsMap: groupBy(heatingSubstations, (x) => x.branchOfficeId),
  };
  return references;
}

export const App: FC = () => {
  const [references, setReferences] = useState<References | null>(null);
  useMount(async () => {
    const references = await loadReferences();
    setReferences(references);
  });
  if (!references) {
    return <div>Загрузка...</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <ReferencesContext.Provider value={references}>
          <Losses />
        </ReferencesContext.Provider>
      </div>
    </div>
  );
};
