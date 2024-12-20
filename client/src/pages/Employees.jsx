import { Download, Menu, Plus, Search, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import CustomModal from "../components/CustomModal";
import CustomMenu from "../components/CustomMenu";
import CustomButton from "../components/CustomButton";
import ModalHeading from "../components/ModalHeading";
import { Edit2, MoreVertical } from "lucide-react";
import * as employeeService from "../services/employees/index"; // Importing employee services

const Employees = () => {
  const [editEmployee, setEditEmployee] = useState(null); // Tracks employee to edit
  const [menu, setMenu] = useState(null); // Tracks open menu
  const [searchTerm, setSearchTerm] = useState(""); // Tracks search term
  const [filter, setFilter] = useState({}); // Tracks department filter
  const [employees, setEmployees] = useState([]); // Employee data
  const [employeeForm, setEmployeeForm] = useState({
    e_name: "",
    email: "",
    phone: "",
    position: "",
    e_dept: "",
    joinDate: "",
  });

  // "_id": "67640c8e29f59fbe8be0040d",
  //           "pic": "example.com",
  //           "e_name": "rattan",
  //           "e_email": "rattan@gmail.com",
  //           "e_phone": 8740340340394,
  //           "e_position": "team lead",
  //           "e_dept": "IT",
  //           "e_joiningdate": "2024-12-06T18:30:00.000Z",
  //           "__v": 0

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        console.log("Fetching employee..");
        const data = await employeeService.listEmployees({
          filter,
          search: searchTerm,
        }); // Fetch employees
        setEmployees(data); // Update employees state with fetched data
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };

    fetchEmployees();
  }, [filter, searchTerm]);

  // Handle employee delete
  const handleDelete = async (id) => {
    try {
      await employeeService.deleteEmployee(id); // Call delete API
      setEmployees(employees.filter((employee) => employee.id !== id)); // Update state
      setMenu(null); // Close menu after delete
    } catch (error) {
      console.error("Failed to delete employee:", error);
    }
  };

  // Handle employee update (Edit)
  const handleUpdate = async () => {
    try {
      const updatedEmployee = await employeeService.updateEmployee(
        editEmployee,
        employeeForm // Pass the updated form data
      );
      setEmployees(
        employees.map((employee) =>
          employee.id === editEmployee ? updatedEmployee : employee
        )
      );
      setEditEmployee(null); // Close the edit modal
      setEmployeeForm({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        joinDate: "",
      }); // Reset the form fields
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  // Handle form change for employee edit
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Pre-fill form when editing employee
  const handleEdit = (employee) => {
    setEditEmployee(employee.id);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      joinDate: employee.joinDate,
    });
  };

  return (
    <div className="candidate-management">
      <div className="header">
        <div className="filters">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => {
              setFilter({
                ...filter,
                e_dept: e?.target?.value == "All" ? null : e?.target?.value,
              });
            }}
          >
            <option value="All">All</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
            <option value="Human Resource">Human Resource</option>
          </select>
        </div>
        <div className="right">
          <div className="search-add">
            <Search color="gray" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Employee Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Department</th>
            <th>Date of Joining</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>
                <div className="profile-cell">
                  <img
                    src={employee.pic || "/placeholder.svg"}
                    alt={employee.e_name}
                    width={40}
                    height={40}
                    className="profile-image"
                  />
                  {employee.e_name}
                </div>
              </td>
              <td>{employee.e_name}</td>
              <td>{employee.email}</td>
              <td>{employee.phone}</td>
              <td>{employee.position}</td>
              <td>
                <span className="department-tag">{employee.e_dept}</span>
              </td>
              <td>{employee.joinDate}</td>
              <td>
                <CustomMenu
                  open={menu === employee.id}
                  button={
                    <button
                      onClick={() =>
                        menu === employee.id
                          ? setMenu(null)
                          : setMenu(employee.id)
                      }
                      className="edit-button"
                    >
                      <MoreVertical color="gray" size={20} />
                    </button>
                  }
                >
                  <li
                    className="menu-item"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </li>
                  <li
                    className="menu-item"
                    onClick={() => handleDelete(employee.id)}
                  >
                    Delete
                  </li>
                </CustomMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomModal open={!!editEmployee} onClose={() => setEditEmployee(null)}>
        <ModalHeading onClose={() => setEditEmployee(null)}>
          Edit Employee Details
        </ModalHeading>
        <div className="modal-body" id="editEmployeeForm">
          <div className="flex-row-wrap">
            <input
              type="text"
              className="input-primary"
              name="name"
              value={employeeForm.e_name}
              onChange={handleFormChange}
              placeholder="Full Name"
            />
            <input
              type="email"
              className="input-primary"
              name="email"
              value={employeeForm.email}
              onChange={handleFormChange}
              placeholder="Email Address"
            />
            <input
              type="tel"
              className="input-primary"
              name="phone"
              value={employeeForm.phone}
              onChange={handleFormChange}
              placeholder="Phone Number"
            />
            <input
              type="text"
              className="input-primary"
              name="position"
              value={employeeForm.position}
              onChange={handleFormChange}
              placeholder="Position"
            />
            <input
              type="text"
              className="input-primary"
              name="department"
              value={employeeForm.e_dept}
              onChange={handleFormChange}
              placeholder="Department"
            />
            <input
              type="date"
              className="input-primary"
              name="joinDate"
              value={employeeForm.joinDate}
              onChange={handleFormChange}
              placeholder="Date of Joining"
            />
          </div>
          <CustomButton onClick={handleUpdate}>Save</CustomButton>
        </div>
      </CustomModal>
    </div>
  );
};

export default Employees;
