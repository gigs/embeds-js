import { required, useForm } from '@modular-forms/preact'
import { render, screen } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { EmbedField } from '../EmbedField'
import { EmbedOptions, OptionsContext } from '../Options'

const TestHarness = ({ options = {} }: { options?: EmbedOptions }) => {
  const [_form, { Form, Field }] = useForm<{ foo: string }>({
    validateOn: 'blur',
  })

  return (
    <OptionsContext.Provider value={options}>
      <Form onSubmit={() => {}}>
        <Field name="foo" validate={required('required')}>
          {(field, props) => (
            <EmbedField of={field}>
              <input {...props} />
            </EmbedField>
          )}
        </Field>
      </Form>
    </OptionsContext.Provider>
  )
}

it('includes default class names', () => {
  const { asFragment } = render(<TestHarness />)
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass(
    'GigsEmbeds',
    'GigsPortingEmbed',
    'GigsEmbeds-field',
  )
})

it('allows to specify a custom class name', () => {
  const { asFragment } = render(
    <TestHarness
      options={{ className: { field: () => 'custom-class-name' } }}
    />,
  )
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass('custom-class-name')
})

it('passes the field name to the custom class name', () => {
  const { asFragment } = render(
    <TestHarness
      options={{ className: { field: ({ name }) => `custom-${name}` } }}
    />,
  )
  const container = asFragment().firstChild?.firstChild
  expect(container).toHaveClass('custom-foo')
})

describe('touched', () => {
  it('allows a custom class for untouched', () => {
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ touched }) =>
              `custom-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      />,
    )
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-untouched')
  })

  it('allows a custom class for touched', async () => {
    const user = userEvent.setup()
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ touched }) =>
              `custom-${touched ? 'touched' : 'untouched'}`,
          },
        }}
      />,
    )
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-touched')
  })
})

describe('dirty', () => {
  it('allows a custom class for undirty', () => {
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ dirty }) => `custom-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      />,
    )
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-undirty')
  })

  it('allows a custom class for dirty', async () => {
    const user = userEvent.setup()
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ dirty }) => `custom-${dirty ? 'dirty' : 'undirty'}`,
          },
        }}
      />,
    )
    await user.type(screen.getByRole('textbox'), 'foo')
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-dirty')
  })
})

describe('valid', () => {
  it('allows a custom class for valid', () => {
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ valid }) => `custom-${valid ? 'valid' : 'invalid'}`,
          },
        }}
      />,
    )
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-valid')
  })

  it('allows a custom class for invalid', async () => {
    const user = userEvent.setup()
    const { asFragment } = render(
      <TestHarness
        options={{
          className: {
            field: ({ valid }) => `custom-${valid ? 'valid' : 'invalid'}`,
          },
        }}
      />,
    )
    await user.click(screen.getByRole('textbox'))
    await user.tab()
    const container = asFragment().firstChild?.firstChild
    expect(container).toHaveClass('custom-invalid')
  })
})
