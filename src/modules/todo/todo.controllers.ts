import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";

interface Data {
  id: string;
  name: string;
  price: number;
}
let data: Data[] = [
  {
    id: uuidv4(),
    name: "chika",
    price: 12,
  },
];

const getData = (req: Request, res: Response) => {
  try {
    res.status(200).json({
      title: "INFO",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: `Error in getAllData:${error}`,
    });
  }
};

const addData = (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    if (!name || typeof price !== "number") {
      return res.status(400).json({
        message: "Name and Price Объязательно",
      });
    }
    const newData: Data = { id: uuidv4(), name, price };
    data.push(newData);

    res.status(201).json({
      message: "Продукт успешно добавлены",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера", error });
  }
};

const updateData = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const index = data.findIndex((item: Data) => item.id === id);

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
  } catch (error) {
    res.status(500).json({
      message: "Ошибка при обновлении продукта",
      error,
    });
  }
};

const deleteData = (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка при удалении продукта",
      error,
    });
  }
};

const searchData = (req: Request, res: Response) => {
  try {
    const { name, minPrice, maxPrice } = req.query;

    let result = data;

    if (name && typeof name === "string") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice as string);
      if (!isNaN(min)) {
        result = result.filter((item) => item.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice as string);
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ошибка при поиске или фильтрации",
      error,
    });
  }
};

const downloadExcel = (req: Request, res: Response) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.send(excelBuffer);
  } catch (error) {
    res.status(500).json({ success: false, message: "Ошибка при скачивании Excel", error });
  }
};

export default { getData, addData, updateData, deleteData, searchData , downloadExcel};
