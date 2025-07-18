```tsx
import { useSWR } from "kaioken/swr"

const fetcher = async (url) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

function EditableUserProfile({ userId }) {
  const { data, loading, error, mutate, isMutating } = useSWR(
    `/api/users/${userId}`,
    fetcher
  )

  const updateUser = async (newName) => {
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
    return res.json()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <input
        value={data.name}
        onchange={(e) => mutate(() => updateUser(e.target.value))}
        disabled={isMutating.value}
      />
      {isMutating.value && <span>Saving...</span>}
    </div>
  )
}
```
