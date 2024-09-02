```jsx
import { Link, useRouter, useAsync } from "kaioken"

export function UserList() {
  const { query, setQuery } = useRouter()
  const { data, loading, error } = useAsync(async () => {
    return (
      await fetch(`https://dummyjson.com/users?q=${q}&select=image`)
    ).json()
  }, [q])

  return (
    <div>
      <input
        type="text"
        value={query.q || ""}
        onchange={(e) => setQuery({ q: e.target.value })}
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error.message}</p>
      ) : (
        <ul>
          {data.users.map((user) => (
            <li key={user.id}>
              <Link to={`/users/${user.id}`}>
                <img src={user.image} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```
