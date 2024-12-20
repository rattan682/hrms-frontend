import { apiClient } from "../../utils/apiClient";
import { apiRoutes } from "../../utils/apiRoutes";

// List all employees
export const listEmployees = async (data) => {
  console.log("List employees");
  let response = await apiClient({
    method: "POST",
    url: apiRoutes.listEmployee,
    data, // Send filter and searchTerm as query params
  });
  return response?.data?.details || [];
};

// Add a new employee
export const newEmployee = async (data) => {
  let response = await apiClient({
    method: "POST",
    url: apiRoutes.addEmployee,
    data,
  });
  return response?.data;
};

// Delete an employee
export const deleteEmployee = async (id) => {
  let response = await apiClient({
    method: "DELETE",
    url: `${apiRoutes.deleteEmployee}/${id}`,
  });
  return response?.data;
};

// Update an employee
export const updateEmployee = async (id, data) => {
  let response = await apiClient({
    method: "PUT",
    url: `${apiRoutes.updateEmployee}/${id}`,
    data,
  });
  return response?.data;
};
