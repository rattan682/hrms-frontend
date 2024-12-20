import { Download, Plus, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";
import ModalHeading from "../components/ModalHeading";
import * as candidateServices from "../services/candidates/index";

const CandidateManagement = () => {
  const [addNew, setAddNew] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    status: "New",
    experience: "",
  });

  // Fetch all candidates
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await candidateServices.listCandidates();
      setCandidates(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  // Add a new candidate
  const addCandidate = async () => {
    try {
      const response = await candidateServices.newCandidate(newCandidate);
      setCandidates([...candidates, response.data]);
      setAddNew(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
    }
  };

  // Update a candidate's status
  const updateCandidateStatus = async (id, newStatus) => {
    try {
      await candidateServices.updateCandidate(id, { status: newStatus });
      const updatedCandidates = candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      );
      setCandidates(updatedCandidates);
    } catch (error) {
      console.error("Error updating candidate status:", error);
    }
  };

  // Delete a candidate
  const deleteCandidate = async (id) => {
    try {
      await candidateServices.deleteCandidate(id);
      const filteredCandidates = candidates.filter(
        (candidate) => candidate.id !== id
      );
      setCandidates(filteredCandidates);
    } catch (error) {
      console.error("Error deleting candidate:", error);
    }
  };

  return (
    <div className="candidate-management">
      <div className="header">
        <div className="filters">
          <select className="filter-select">
            <option value="">All</option>
            <option value="Schedules">Schedules</option>
            <option value="Rejected">Rejected</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Selected">Selected</option>
          </select>
          <select className="filter-select">
            <option value="">All</option>
            <option value="Designer">Designer</option>
            <option value="Developer">Developer</option>
            <option value="Human Resource">Human Resource</option>
          </select>
        </div>
        <div className="right">
          <div className="search-add">
            <Search color="gray" size={20} />
            <input type="text" placeholder="Search" />
          </div>
          <button onClick={() => setAddNew(true)} className="add-button">
            Add New Candidate
          </button>
        </div>
      </div>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Sr no.</th>
            <th>Candidates Name</th>
            <th>Email Address</th>
            <th>Phone Number</th>
            <th>Position</th>
            <th>Status</th>
            <th>Experience</th>
            <th>Resume</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate, index) => (
            <tr key={candidate.id} className={candidate.status.toLowerCase()}>
              <td>{String(index + 1).padStart(2, "0")}</td>
              <td>{candidate.name}</td>
              <td>{candidate.email}</td>
              <td>{candidate.phone}</td>
              <td>{candidate.position}</td>
              <td>
                <select
                  className="filter-select no-border"
                  value={candidate.status}
                  onChange={(e) =>
                    updateCandidateStatus(candidate.id, e.target.value)
                  }
                >
                  <option value="New">New</option>
                  <option value="Schedules">Schedules</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                </select>
              </td>
              <td>{candidate.experience}</td>
              <td>
                <button className="download-button">
                  <Download className={candidate.status.toLowerCase()} />
                </button>
              </td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => deleteCandidate(candidate.id)}
                >
                  <Trash2 color="gray" size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CustomModal open={addNew} onClose={() => setAddNew(false)}>
        <ModalHeading onClose={() => setAddNew(false)}>
          Add New Candidate
        </ModalHeading>
        <div className="modal-body" id="addCandidateForm">
          <div className="flex-row-wrap">
            <input
              type="text"
              className="input-primary"
              placeholder="Full Name"
              value={newCandidate.name}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, name: e.target.value })
              }
            />
            <input
              type="email"
              className="input-primary"
              placeholder="Email"
              value={newCandidate.email}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, email: e.target.value })
              }
            />
            <input
              type="text"
              className="input-primary"
              placeholder="Phone Number"
              value={newCandidate.phone}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, phone: e.target.value })
              }
            />
            <input
              type="text"
              className="input-primary"
              placeholder="Position"
              value={newCandidate.position}
              onChange={(e) =>
                setNewCandidate({ ...newCandidate, position: e.target.value })
              }
            />
          </div>
          <div className="checkbox-wrapper">
            <input type="checkbox" id="checkbox1" />
            <label htmlFor="checkbox1">
              I hereby declare that the above information is true to the best of
              my knowledge and belief.
            </label>
          </div>
          <CustomButton onClick={addCandidate}>Save</CustomButton>
        </div>
      </CustomModal>
    </div>
  );
};

export default CandidateManagement;
