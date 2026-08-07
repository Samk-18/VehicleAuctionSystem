import { useEffect, useState } from "react";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateUserRoles,
} from "../../services/adminUserService";
import { useNavigate } from "react-router-dom";

const ALL_ROLES = ["ROLE_BUYER", "ROLE_SELLER", "ROLE_ADMIN"];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const username = "Admin"; // replace with dynamic username if needed

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data || []);
      setError("");
    } catch (err) {
      setError("Unable to load users. Backend not ready.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      await blockUser(id);
      loadUsers();
    } catch (err) {
      alert("Failed to block user");
    }
  };

  const handleUnblock = async (id) => {
    try {
      await unblockUser(id);
      loadUsers();
    } catch (err) {
      alert("Failed to unblock user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const toggleRole = async (user, role) => {
    const userId = user.userId || user.id;
    const current = new Set((user.roles || []).map((r) => r.roleName));

    if (current.has(role)) {
      current.delete(role);
    } else {
      current.add(role);
    }

    if (current.size === 0) {
      alert("A user must have at least one role.");
      return;
    }

    try {
      await updateUserRoles(userId, Array.from(current));
      loadUsers();
    } catch (err) {
      alert("Failed to update roles");
    }
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-dark text-white rounded shadow-sm">
        <h4 className="mb-0">Manage Users</h4>
        <span className="badge bg-light text-dark px-3 py-2">
          Username: <strong>{username}</strong>
        </span>
      </div>

      {/* Back Button */}
      <div className="mb-3">
        <button
          className="btn btn-primary fw-semibold"
          onClick={() => navigate("/admin-ui/dashboard")}
        >
          ← Back to Admin Dashboard
        </button>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center text-muted fw-semibold">
          Loading users...
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger text-center fw-semibold">
          {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-hover table-bordered shadow-sm align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Roles</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {users.map((u) => {
                const userId = u.userId || u.id;

                return (
                  <tr key={userId}>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.status === "ACTIVE" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center flex-wrap">
                        {ALL_ROLES.map((role) => {
                          const checked = u.roles?.some(
                            (r) => r.roleName === role
                          );
                          return (
                            <label
                              key={role}
                              className="form-check form-check-inline mb-0"
                            >
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={checked || false}
                                onChange={() => toggleRole(u, role)}
                              />
                              {role.replace("ROLE_", "")}
                            </label>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {u.status === "ACTIVE" ? (
                          <button
                            className="btn btn-sm btn-warning fw-semibold"
                            onClick={() => handleBlock(userId)}
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            className="btn btn-sm btn-secondary fw-semibold"
                            onClick={() => handleUnblock(userId)}
                          >
                            Unblock
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-danger fw-semibold"
                          onClick={() => handleDelete(userId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;