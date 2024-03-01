import { minLength, required, useForm } from '@modular-forms/preact'
import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { EmbedFieldError } from '../EmbedFieldError'
import { EmbedOptions, OptionsContext } from '../Options'

const TestHarness = ({ options = {} }: { options?: EmbedOptions }) => {
  const [_form, { Form, Field }] = useForm<{ foo: string }>({
    validateOn: 'blur',
  })

  return (
    <OptionsContext.Provider value={options}>
      <Form onSubmit={() => {}}>
        <Field
          name="foo"
          validate={[required('required'), minLength(2, 'required')]}
        >
          {(field, props) => (
            <>
              <EmbedFieldError of={field} />
              <input data-testid="input" {...props} />
            </>
          )}
        </Field>
        <button type="submit">Submit</button>
      </Form>
    </OptionsContext.Provider>
  )
}

async function triggerError() {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button'))
  await screen.findByText('required')
}

it('renders no error when there are no errors', () => {
  const { asFragment } = render(<TestHarness />)
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveAttribute('data-testid', 'input')
})

it('includes default class names', async () => {
  const { asFragment } = render(<TestHarness />)
  await triggerError()
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass(
    'GigsEmbeds',
    'GigsPortingEmbed',
    'GigsEmbeds-error',
  )
})

it('allows to specify a custom class name', async () => {
  const { asFragment } = render(
    <TestHarness
      options={{ className: { error: () => 'custom-class-name' } }}
    />,
  )
  await triggerError()
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass('custom-class-name')
})

it('passes the field name to the custom class name', async () => {
  const { asFragment } = render(
    <TestHarness
      options={{ className: { error: ({ name }) => `custom-${name}` } }}
    />,
  )
  await triggerError()
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass('custom-foo')
})

describe('touched', () => {
  it('allows a custom class for untouched', async () => {
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            error: ({ touched }) =>
              `custom-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      />,
    )
    await triggerError()
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-untouched')
  })

  it('allows a custom class for touched', async () => {
    const user = userEvent.setup()
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            error: ({ touched }) =>
              `custom-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      />,
    )
    await triggerError()
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-touched')
  })
})

describe('dirty', () => {
  it('allows a custom class for undirty', async () => {
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            error: ({ dirty }) => `custom-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      />,
    )
    await triggerError()
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-undirty')
  })

  it('allows a custom class for dirty', async () => {
    const user = userEvent.setup()
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            error: ({ dirty }) => `custom-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      />,
    )
    await triggerError()
    await user.type(screen.getByRole('textbox'), 'a')
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-dirty')
  })
})
