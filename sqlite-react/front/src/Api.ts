import { Id } from "src/Utils/types";

export interface BranchOfficeEntity {
  id: Id;
  name: string;
}

export interface HeatingSubstationEntity {
  id: Id;
  branch_office_id: Id;
  name: string;
}

export interface LossEntity {
  id: Id;
  heating_substation_id: Id;
  amount: number;
  datetime: string;
}

export interface LossSaveData {
  heating_substation_id: Id;
  amount: number;
}

const baseUrl = "http://localhost:5555";

export class Api {
  public static async selectBranchOffices(): Promise<BranchOfficeEntity[]> {
    const response = await fetch(`${baseUrl}/api/branchOffices`, {
      method: "GET",
    });
    return await response.json();
  }

  public static async selectHeatingSubstations(): Promise<HeatingSubstationEntity[]> {
    const response = await fetch(`${baseUrl}/api/heatingSubstations`, {
      method: "GET",
    });
    return await response.json();
  }

  public static async selectLosses(): Promise<LossEntity[]> {
    const response = await fetch(`${baseUrl}/api/losses`, {
      method: "GET",
    });
    return await response.json();
  }

  public static async getLoss(id: Id): Promise<LossEntity> {
    const response = await fetch(`${baseUrl}/api/losses?id=${id}`, {
      method: "GET",
    });
    return await response.json();
  }

  public static async saveLoss(data: LossSaveData, id?: Id): Promise<LossEntity> {
    const response = await fetch(`${baseUrl}/api/losses?id=${id || ""}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  public static async deleteLoss(id: Id): Promise<void> {
    await fetch(`${baseUrl}/api/losses?id=${id}`, {
      method: "DELETE",
    });
  }
}
