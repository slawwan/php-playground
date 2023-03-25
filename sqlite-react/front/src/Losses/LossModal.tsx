import { Button, CurrencyInput, Gapped, Modal, Select } from "@skbkontur/react-ui";
import React, { FC, useContext, useMemo, useRef, useState } from "react";
import { Id } from "../Utils/types";
import { useMount } from "src/Utils/hooks";
import { ReferencesContext } from "src/App/ReferencesContext";
import { delay } from "../Utils/utils";
import { FormItem } from "src/Components/FormItem";
import { createValidator, ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";

interface LossModalValue {
  branchOfficesId: Id | null;
  heatingSubstationId: Id | null;
  amount: number | null;
  datetime: string | null;
}

export interface LossModalSourceValue {
  heatingSubstationId: Id | null;
  amount: number | null;
  datetime: string | null;
}

export interface LossModalResultValue {
  heatingSubstationId: Id;
  amount: number;
}

export interface LossModalProps {
  title: string;
  loadValue: () => Promise<LossModalSourceValue>;
  onSave: (value: LossModalResultValue) => Promise<void>;
  onCancel: () => void;
}

const validate = createValidator<LossModalValue>((b, v) => {
  b.prop(
    (x) => x.branchOfficesId,
    (b) => {
      b.invalid((x) => !x, "Укажите филиал", "submit");
    }
  );
  b.prop(
    (x) => x.heatingSubstationId,
    (b) => {
      b.invalid((x) => !!v.branchOfficesId && !x, "Укажите тепловой узел", "submit");
    }
  );
  b.prop(
    (x) => x.amount,
    (b) => {
      b.invalid((x) => !x, "Укажите величину утечки", "submit");
    }
  );
});

export const LossModal: FC<LossModalProps> = (props) => {
  const container = useRef<ValidationContainer>(null);
  const [value, setValue] = useState<LossModalValue | null>(null);
  const [saving, setSaving] = useState(false);
  const references = useContext(ReferencesContext);
  useMount(async () => {
    const value = await props.loadValue();
    setValue({
      branchOfficesId: value.heatingSubstationId
        ? references.heatingSubstationMap[value.heatingSubstationId].branchOfficeId
        : null,
      heatingSubstationId: value.heatingSubstationId,
      amount: value.amount,
      datetime: value.datetime,
    });
  });
  const branchOfficeItems = useMemo(
    () => references.branchOffices.map<[Id, string]>((x) => [x.id, x.name]),
    [references.branchOffices]
  );
  const heatingSubstationItems = useMemo(
    () =>
      value && value.branchOfficesId
        ? references.heatingSubstationGroupsMap[value.branchOfficesId].map<[Id, string]>((x) => [x.id, x.name])
        : [],
    [value?.branchOfficesId, references.heatingSubstationGroupsMap]
  );

  if (!value) {
    return (
      <Modal onClose={props.onCancel}>
        <Modal.Header>Загрузка...</Modal.Header>
      </Modal>
    );
  }
  const setValuePartial = (partial: Partial<typeof value>): void => {
    setValue({ ...value, ...partial });
  };
  const handleSave = async (): Promise<void> => {
    const isValid = await container.current?.validate();
    if (!isValid) {
      return;
    }
    setSaving(true);
    await delay(500);
    const result: LossModalResultValue = {
      heatingSubstationId: value.heatingSubstationId!,
      amount: value.amount!,
    };
    try {
      await props.onSave(result);
    } catch (e) {
      setSaving(false);
    }
  };

  const validation = validate(value);

  return (
    <Modal onClose={props.onCancel} disableClose={saving} ignoreBackgroundClick>
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Body>
        <ValidationContainer ref={container}>
          {value.datetime && <FormItem title={"Время регистрации повреждения"}>{value.datetime}</FormItem>}
          <FormItem title={"Филиал"}>
            <ValidationWrapper validationInfo={validation.getNode((x) => x.branchOfficesId).get()}>
              <Select
                placeholder={"Выберите значение из списка"}
                value={value.branchOfficesId}
                onValueChange={(x) => setValuePartial({ branchOfficesId: x, heatingSubstationId: null })}
                items={branchOfficeItems}
                width={300}
                disabled={saving}
              />
            </ValidationWrapper>
          </FormItem>
          <FormItem title={"Тепловой узел"}>
            <ValidationWrapper validationInfo={validation.getNode((x) => x.heatingSubstationId).get()}>
              <Select
                placeholder={"Выберите значение из списка"}
                value={value.heatingSubstationId}
                onValueChange={(x) => setValuePartial({ heatingSubstationId: x })}
                items={heatingSubstationItems}
                disabled={!value.branchOfficesId || saving}
                width={300}
              />
            </ValidationWrapper>
          </FormItem>
          <FormItem title={"Величина утечки, т/ч"}>
            <ValidationWrapper validationInfo={validation.getNode((x) => x.amount).get()}>
              <CurrencyInput
                placeholder={"Укажите значение"}
                value={value.amount}
                onValueChange={(x) => setValuePartial({ amount: x })}
                width={300}
                disabled={saving}
                fractionDigits={null}
                align={"left"}
              />
            </ValidationWrapper>
          </FormItem>
        </ValidationContainer>
      </Modal.Body>
      <Modal.Footer>
        <Gapped gap={8}>
          <Button use={"success"} loading={saving} onClick={handleSave}>
            Сохранить
          </Button>
          <Button disabled={saving} onClick={props.onCancel}>
            Отменить
          </Button>
        </Gapped>
      </Modal.Footer>
    </Modal>
  );
};
