```jsx
import { useId } from "kaioken"

function App() {
  return (
    <form>
      <FormItem name="First Name" />
      <FormItem name="Last Name" />
    </form>
  )
}

function FormItem({ name }) {
  const id = useId()

  return (
    <div className="form-item">
      <label htmlFor={id}>{name}</label>
      <input id={id} type="text" name={name} />
    </div>
  )
}
```
