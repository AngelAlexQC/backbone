("use strict");
const fs = require("fs");

function removeAccents(str) {
    if (!str) return "";
    if (typeof str !== "string") return "";
    return str
        .replace(/[áàäâ]/gi, "a")
        .replace(/[éèëê]/gi, "e")
        .replace(/[íìïî]/gi, "i")
        .replace(/[óòöô]/gi, "o")
        .replace(/[úùüû]/gi, "u")
        .replace(/[ñ]/gi, "n");
}

const excelToJson = require("convert-excel-to-json");

const result = excelToJson({
    sourceFile: "./original_data.xls",
    header: {
        rows: 1,
    },
    columnToKey: {
        "*": "{{columnHeader}}",
    },
});

const originalArray = [];
const zipCodes = [];
let stateCount = 0;
let totalStates = 0;
let rowCount = 0;
let totalRows = 0;

const mapToResponse = (data) => ({
    zip_code: data.d_codigo,
    locality: removeAccents(data.d_ciudad).toUpperCase(),
    federal_entity: {
        key: Number(data.c_estado),
        name: removeAccents(data.d_estado).toUpperCase(),
        code: data.c_CP || null,
    },
    settlements: [
        {
            key: Number(data.id_asenta_cpcons),
            name: removeAccents(data.d_asenta).toUpperCase(),
            zone_type: removeAccents(data.d_zona).toUpperCase(),
            settlement_type: {
                name: removeAccents(data.d_tipo_asenta),
            },
        },
    ],
    municipality: {
        key: Number(data.c_mnpio),
        name: removeAccents(data.D_mnpio).toUpperCase(),
    },
});
Object.keys(result).forEach((key) => {
    const state = result[key];
    totalStates += 1;
    state.forEach((row, index) => {
        totalRows += 1;
    });
});
Object.keys(result).forEach((key) => {
    const state = result[key];
    stateCount += 1;
    state.forEach((row, index) => {
        rowCount += 1;
        originalArray.push(row);
        let indexOfZipCode = zipCodes.findIndex(
            (zipCode) => zipCode.zip_code === row.d_codigo
        );
        if (row.d_codigo) {
            if (indexOfZipCode === -1) {
                zipCodes.push(mapToResponse(row));
            } else {
                zipCodes[indexOfZipCode].settlements.push({
                    key: Number(row.id_asenta_cpcons),
                    name: removeAccents(row.d_asenta).toUpperCase(),
                    zone_type: removeAccents(row.d_zona).toUpperCase(),

                    settlement_type: {
                        name: removeAccents(row.d_tipo_asenta),
                    },
                });
            }
        }
        // write file
        const path = `./resources/data/${row.d_codigo}.json`;
        if (indexOfZipCode !== -1) {
            fs.writeFileSync(path, JSON.stringify(zipCodes[indexOfZipCode]));
            console.log(
                `Processed ${rowCount} of ${totalRows}, zip code ${
                    row.d_codigo
                } - ${index + 1} of ${state.length}, state ${
                    stateCount + 1
                } of ${totalStates}`
            );
        }
    });
});
