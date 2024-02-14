import { useEffect, useState } from 'preact/hooks'

// This is just an example to illustrate tests working with fetch
export function TestComponentWithFetch({ id = 'abc' }) {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    fetch(`https://api.example.com/users/${id}`)
      .then((res) => res.json())
      .then((user) => setName(user.name))
  }, [id])

  if (!name) {
    return <div>Loading</div>
  }

  return <div>Hello, {name}</div>
}
