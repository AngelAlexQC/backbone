"use strict";

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

const finalArray = [];
let stateCount = 0;
let totalStates = 0;
let rowCount = 0;
let totalRows = 0;
Object.keys(result).forEach((key) => {
    const state = result[key];
    totalRows += state.length;
    totalStates += 1;
});
Object.keys(result).forEach((key) => {
    const state = result[key];
    stateCount++;
    state.map((item) => {
        const zip_code = item.d_codigo;
        if (finalArray.indexOf(zip_code) === -1) {
            finalArray.push({
                zip_code,
                locality: (item.d_ciudad || "").toUpperCase(),
                federal_entity: {
                    key: Number(item.c_estado),
                    name: item.d_estado.toUpperCase(),
                    code: item.c_CP || null,
                },
                settlements: [
                    {
                        key: Number(item.id_asenta_cpcons),
                        name: item.d_asenta.toUpperCase(),
                        zone_type: item.d_zona.toUpperCase(),
                        settlement_type: {
                            name: item.d_tipo_asenta.toUpperCase(),
                        },
                    },
                ],
                municipality: {
                    key: Number(item.c_mnpio),
                    name: item.D_mnpio.toUpperCase(),
                },
            });
        } else {
            const index = finalArray.findIndex(
                (item) => item.zip_code === zip_code
            );
            finalArray[index].settlements.push({
                key: Number(item.id_asenta_cpcons),
                name: item.d_asenta.toUpperCase(),
                zone_type: item.d_zona.toUpperCase(),
                settlement_type: {
                    name: item.d_tipo_asenta,
                },
            });
        }
        rowCount++;
        console.log(
            `Processing ${stateCount} of ${totalStates} states, ${rowCount} of ${totalRows} rows`
        );
    });
});

// Save JSON file
const fs = require("fs");
const formattedJson = JSON.stringify(finalArray, null, 2);
fs.writeFileSync("./data.json", formattedJson);
console.log("JSON file created");
