import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { z } from "zod";
import {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "@/app/api";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
});

type UserFormValues = z.infer<typeof userSchema>;

export function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { data: existingUser, isLoading } = useGetUserByIdQuery(id ?? "", {
    skip: !isEditing,
  });
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema) });

  useEffect(() => {
    if (existingUser) {
      reset({ name: existingUser.name, email: existingUser.email });
    }
  }, [existingUser, reset]);

  const onSubmit = async (values: UserFormValues) => {
    if (isEditing && id) {
      await updateUser({ id, payload: values });
    } else {
      await createUser(values);
    }
    navigate("/users", { replace: true });
  };

  return (
    <div className="card" style={{ maxWidth: 720, margin: "0 auto" }}>
      <div
        className="row"
        style={{ justifyContent: "space-between", marginBottom: "1rem" }}
      >
        <div>
          <h2>{isEditing ? "Edit user" : "Add user"}</h2>
          <p className="helper">
            The form validates that both the name and email are present and
            well-formed.
          </p>
        </div>
        <Link
          to="/users"
          className="secondary"
          style={{
            display: "inline-block",
            padding: "0.7rem 1rem",
            borderRadius: 8,
          }}
        >
          Back to list
        </Link>
      </div>

      {isEditing && isLoading ? <p className="helper">Loading user…</p> : null}

      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <label className="field">
          <span>Name</span>
          <input {...register("name")} />
          {errors.name ? (
            <span className="error-text">{errors.name.message}</span>
          ) : null}
        </label>
        <label className="field">
          <span>Email</span>
          <input {...register("email")} type="email" />
          {errors.email ? (
            <span className="error-text">{errors.email.message}</span>
          ) : null}
        </label>
        <div className="row">
          <button className="primary" type="submit">
            Save
          </button>
          <Link
            to="/users"
            className="secondary"
            style={{
              display: "inline-block",
              padding: "0.7rem 1rem",
              borderRadius: 8,
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
