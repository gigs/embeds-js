import { useState } from 'preact/hooks'

export type WelcomeEmbedProps = {
  token: string
  name?: string
  onCounterChange: (count: number) => unknown
}

export function WelcomeEmbed({
  name = 'default',
  token,
  onCounterChange,
}: WelcomeEmbedProps) {
  return (
    <div>
      Hello, {name} with {token}!
      <Counter onChange={(count) => onCounterChange(count)} />
    </div>
  )
}

type CounterProps = {
  onChange: (count: number) => unknown
}

function Counter({ onChange }: CounterProps) {
  const [count, setCount] = useState(0)
  return (
    <button
      onClick={() => {
        setCount(count + 1)
        onChange(count + 1)
      }}
    >
      Count: {count}
    </button>
  )
}
