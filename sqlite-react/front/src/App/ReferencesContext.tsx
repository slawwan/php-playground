import { Id } from "src/Utils/types";
import React from "react";

export interface BranchOffice {
  id: Id;
  name: string;
}

export interface HeatingSubstation {
  id: Id;
  name: string;
  branchOfficeId: Id;
}

export interface References {
  branchOffices: BranchOffice[];
  branchOfficesMap: Record<Id, BranchOffice>;
  heatingSubstationMap: Record<Id, HeatingSubstation>;
  heatingSubstationGroupsMap: Record<Id, HeatingSubstation[]>;
}

const references: References = {
  branchOffices: [],
  branchOfficesMap: {},
  heatingSubstationMap: {},
  heatingSubstationGroupsMap: {},
};

export const ReferencesContext = React.createContext<References>(references);
