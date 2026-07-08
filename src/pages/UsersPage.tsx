import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useLogoutMutation,
} from "@/app/api";
import type { RootState } from "@/app/store";
import { performLogout } from "@/app/logout";

export function UsersPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.auth.username);
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await performLogout({ dispatch, navigate, logout });
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <div className="card">
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: "1rem" }}
      >
        <div>
          <h2>Users</h2>
          <p className="helper">
            Signed in as {username ?? "authenticated user"}.
          </p>
        </div>
        <div className="row">
          <Link
            to="/users/new"
            className="primary"
            style={{
              display: "inline-block",
              padding: "0.7rem 1rem",
              borderRadius: 8,
            }}
          >
            Add user
          </Link>
          {/* <button className="secondary" onClick={handleLogout}>
            Logout
          </button> */}
        </div>
      </div>

      {isLoading ? <p className="helper">Loading users…</p> : null}
      {error ? (
        <p className="error-text">Unable to load users right now.</p>
      ) : null}
      {!isLoading && !error && users.length === 0 ? (
        <p className="empty-state">No users yet. Create the first one.</p>
      ) : null}

      <div className="list">
        {users.map((user) => (
          <div key={user.id} className="list-item">
            <div>
              <strong>{user.name}</strong>
              <div className="helper">{user.email}</div>
            </div>
            <div className="row">
              <Link
                to={`/users/${user.id}/edit`}
                className="secondary"
                style={{
                  display: "inline-block",
                  padding: "0.7rem 1rem",
                  borderRadius: 8,
                }}
              >
                Edit
              </Link>
              <button className="danger" onClick={() => handleDelete(user.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
