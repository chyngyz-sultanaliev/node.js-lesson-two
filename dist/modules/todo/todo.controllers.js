"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const XLSX = __importStar(require("xlsx"));
let data = [
    {
        id: (0, uuid_1.v4)(),
        name: "chika",
        price: 12,
    },
];
const getData = (req, res) => {
    try {
        res.status(200).json({
            title: "INFO",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: `Error in getAllData:${error}`,
        });
    }
};
const addData = (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || typeof price !== "number") {
            return res.status(400).json({
                message: "Name and Price Объязательно",
            });
        }
        const newData = { id: (0, uuid_1.v4)(), name, price };
        data.push(newData);
        res.status(201).json({
            message: "Продукт успешно добавлены",
            data,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Ошибка сервера", error });
    }
};
const updateData = (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const index = data.findIndex((item) => item.id === id);
        if (index === -1) {
            return res.status(404).json({
                message: "Продукт не найден",
            });
        }
        data[index] = { ...data[index], ...updatedData };
        res.status(200).json({
            message: "Продукт успешно обновлены",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Ошибка при обновлении продукта",
            error,
        });
    }
};
const deleteData = (req, res) => {
    try {
        const { id } = req.params;
        const index = data.findIndex((item) => item.id === id);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Продукт не найден",
            });
        }
        data.splice(index, 1);
        res.status(200).json({
            success: true,
            message: "Продукт успешно удалены",
            data,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Ошибка при удалении продукта",
            error,
        });
    }
};
const searchData = (req, res) => {
    try {
        const { name, minPrice, maxPrice } = req.query;
        let result = data;
        if (name && typeof name === "string") {
            result = result.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
        }
        if (minPrice) {
            const min = parseFloat(minPrice);
            if (!isNaN(min)) {
                result = result.filter((item) => item.price >= min);
            }
        }
        if (maxPrice) {
            const max = parseFloat(maxPrice);
            if (!isNaN(max)) {
                result = result.filter((item) => item.price <= max);
            }
        }
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Продукт не найден. Такого продукта нет.",
            });
        }
        res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Ошибка при поиске или фильтрации",
            error,
        });
    }
};
const downloadExcel = (req, res) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
        const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
        res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(excelBuffer);
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Ошибка при скачивании Excel", error });
    }
};
exports.default = { getData, addData, updateData, deleteData, searchData, downloadExcel };
//# sourceMappingURL=todo.controllers.js.map