<?php

require_once($_SERVER["DOCUMENT_ROOT"] . "/database.php");

global $db;

$url= $_SERVER["REQUEST_URI"];
$branch_offices = $db->select_branch_offices();
$heating_substation = $db->select_heating_substations();
$losses = $db->select_losses();
?>

<html>
<head>
<script>
    const branch_offices = <?php echo json_encode($branch_offices)?>;
    const heating_substations = <?php echo json_encode($heating_substation)?>;
    const losses = <?php echo json_encode($losses)?>;

    const branch_offices_options = branch_offices.map(x => ({value: x.id, label: x.name}));
    const heating_substations_options = {};
    for (const x of heating_substations) {
        const option = {value: x.id, label: x.name};
        const branch_office_id = x.branch_office_id;
        if (!heating_substations_options[branch_office_id]) {
            heating_substations_options[branch_office_id] = [];
        }
        heating_substations_options[branch_office_id].push(option);
    }

    function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    function toObject(array, keySelector) {
        const result = {};
        for (const x of array) {
            result[keySelector(x)] = x;
        }
        return result;
    }

    const branch_offices_map = toObject(branch_offices, x => x.id);
    const heating_substations_map = toObject(heating_substations, x => x.id);

    class Api {
        static async selectLosses() {
            const response = await fetch("/api/losses", {
                method: "GET",
            })
            return await response.json();
        }

        static async saveLoss(value) {
            const response = await fetch("/api/losses", {
                method: "POST",
                body: JSON.stringify(value),
            })
            return await response.json();
        }

        static async removeLoss(id) {
            await fetch(`/api/losses?id=${id}`, {
                method: "DELETE",
            })
        }
    }

    class Dom {
        static getBranchOfficeSelect() {
            return document.getElementById("branch_office");
        }

        static getHeatingSubstationSelect() {
            return document.getElementById("heating_substation");
        }

        static getAmountInput() {
            return document.getElementById("amount");
        }

        static getSubmitButton() {
            return document.getElementById("submit");
        }

        static getStatusLabel() {
            return document.getElementById("status");
        }
    }

    function initSelect(select, options) {
        function createOptionTag(value, label) {
            const option = document.createElement("option");
            option.value = value;
            option.innerText = label;
            return option;
        }

        select.innerHTML = "";
        select.append(createOptionTag("", "Выберете значение из списка"));
        for (const x of options) {
            select.append(createOptionTag(x.value, x.label));
        }
    }

    function getFormValue() {
        function safeParseInt(value) {
            const n = parseInt(value);
            return isNaN(n) ? null : n;
        }

        function safeParseFloat(value) {
            const n = parseFloat(value);
            return isNaN(n) ? null : n;
        }

        return {
            branch_office_id: safeParseInt(Dom.getBranchOfficeSelect().value),
            heating_substation_id: safeParseInt(Dom.getHeatingSubstationSelect().value),
            amount: safeParseFloat(Dom.getAmountInput().value),
        }
    }

    function setStatus(text) {
        const statusLabel = Dom.getStatusLabel();
        statusLabel.innerText = text;
        statusLabel.style.color = "black";
    }

    function setError(text) {
        const statusLabel = Dom.getStatusLabel();
        statusLabel.innerText = text;
        statusLabel.style.color = "red";
    }

    function handleChangeBranchOffice(e) {
        const id = e.target.value;
        initSelect(Dom.getHeatingSubstationSelect(), heating_substations_options[id] || []);
    }

    async function handleSubmit() {
        const value = getFormValue();
        if (value.branch_office_id == null) {
            setError("Укажите филиал");
            return;
        }
        if (value.heating_substation_id == null) {
            setError("Укажите тепловой узел");
            return;
        }
        if (!value.amount) {
            setError("Укажите размер потерь");
            return;
        }
        setStatus("Сохранение...");
        try {
            await Promise.all([
                delay(1000),
                Api.saveLoss(value),
            ]);
            setStatus("Сохранеие завершено");
            (async function(){
                await delay(1000);
                setStatus("Укажите значения и отправьте форму");
            })();
            Dom.getAmountInput().value = "";
            const losses = await Api.selectLosses();
            updateLosses(losses);
        }
        catch (e) {
            setError(e.message);
        }
    }

    function updateLosses(items) {
        function buildCell (value) {
            const td = document.createElement("td");
            td.innerText = value;
            return td;
        }
        function buildCellRemove (id) {
            const button = document.createElement("button");
            button.innerText = "X";
            async function handleRemove() {
                try {
                    button.disabled = true;
                    await Api.removeLoss(id)
                    const losses = await Api.selectLosses();
                    updateLosses(losses);
                }
                catch (e) {
                    console.error(e.message);
                }
            }
            button.addEventListener("click", handleRemove);
            const td = document.createElement("td");
            td.append(button)
            return td;
        }
        function buildRow (item, index) {
            const tr = document.createElement("tr");
            const heating_substation = heating_substations_map[item.heating_substation_id];
            const branch_office = branch_offices_map[heating_substation.branch_office_id];
            tr.append(
                buildCell(index + 1),
                buildCell(branch_office.name),
                buildCell(heating_substation.name),
                buildCell(item.datetime),
                buildCell(item.amount),
                buildCellRemove(item.id),
            );
            return tr;
        }
        const tbody = document.getElementById("losses").getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";
        tbody.append(...items.map((x, i) => buildRow(x, i)))
    }

    document.addEventListener("DOMContentLoaded", function(){
        const branchOfficeSelect = Dom.getBranchOfficeSelect();
        initSelect(branchOfficeSelect, branch_offices_options);
        branchOfficeSelect.addEventListener("change", handleChangeBranchOffice);
        initSelect(Dom.getHeatingSubstationSelect(), []);
        Dom.getSubmitButton().addEventListener("click", handleSubmit);
        updateLosses(losses);
    });
</script>
</head>
<body>
<div>
    <select id="branch_office">
        <option/>
    </select>
    <select id="heating_substation">
        <option/>
    </select>
    <input id="amount" type="number" min="0" value="0" step="any"/>
    <button id="submit">Зафиксировать утечку</button>
</div>
<div id="status">Укажите значения и отправьте форму</div>
<div id="losses">
    <table>
        <thead>
        <tr>
            <th>№</th>
            <th>Филиал</th>
            <th>Тепловой узел</th>
            <th>Время</th>
            <th>Величина утечки, т/ч</th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
</body>
</html>
