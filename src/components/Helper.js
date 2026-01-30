import exportFromJSON from "export-from-json";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const fileName = "Audit_Logs";

// -----------------------
// Export as CSV
// -----------------------
export const exportCSV = (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  exportFromJSON({
    data,
    fileName,
    exportType: exportFromJSON.types.csv,
  });
};

// -----------------------
// Export as Excel
// -----------------------
export const exportExcel = (data) => {
  if (!data || data.length === 0) {
    alert("No data available to export");
    return;
  }

  // Convert JSON → Worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "AuditLogs");

  // Generate Excel file
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Save file
  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${fileName}.xlsx`);
};
