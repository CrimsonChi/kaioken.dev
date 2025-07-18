```tsx
import { useForm } from "kaioken/form"

type LoginFormData = {
  email: string
  password: string
}

function LoginForm() {
  const form = useForm<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ state }) => {
      console.log("Login attempt:", state)
    },
  })

  return (
    <form
      onsubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: (value) => {
            if (!value) return "Email is required"
            if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format"
          },
        }}
        children={(field) => (
          <div>
            <label>Email</label>
            <input
              type="email"
              value={field.state.value}
              onchange={(e) => field.handleChange(e.target.value)}
              onblur={field.handleBlur}
            />
            {field.state.errors.length > 0 && (
              <span style={{ color: "red" }}>{field.state.errors[0]}</span>
            )}
          </div>
        )}
      />

      <form.Field
        name="password"
        validators={{
          onChange: (value) => {
            if (!value) return "Password is required"
            if (value.length < 6)
              return "Password must be at least 6 characters"
          },
        }}
        children={(field) => (
          <div>
            <label>Password</label>
            <input
              type="password"
              value={field.state.value}
              onchange={(e) => field.handleChange(e.target.value)}
              onblur={field.handleBlur}
            />
            {field.state.errors.length > 0 && (
              <span style={{ color: "red" }}>{field.state.errors[0]}</span>
            )}
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting] as const}
        children={([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        )}
      />
    </form>
  )
}
```
