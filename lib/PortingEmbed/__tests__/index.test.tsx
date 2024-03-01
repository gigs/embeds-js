import { render, screen, waitFor } from '@testing-library/preact'
import userEvent from '@testing-library/user-event'

import { db } from '@/testing/db'
import { connectSessionFactory } from '@/testing/factories/connectSession'
import { portingFactory } from '@/testing/factories/porting'
import { subscriptionFactory } from '@/testing/factories/subscription'

import { PortingStatus } from '../../types'
import { PortingEmbed } from '../'

const project = 'test_project'

async function createFixtures() {
  const subscription = await subscriptionFactory
    .associations({
      porting: portingFactory
        .params({
          required: [
            'accountNumber',
            'accountPin',
            'firstName',
            'lastName',
            'address',
            'donorProviderApproval',
          ],
        })
        .build(),
    })
    .create()
  const connectSession = connectSessionFactory
    .completePorting(subscription.id)
    .build()
  return connectSession
}

beforeEach(() => {
  render(
    <>
      <div id="mount" />
      <button type="submit" form="gigsPortingEmbedForm">
        Submit
      </button>
    </>,
  )
})

describe('mounting', () => {
  it('mounts into a DOM selector', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount('#mount')
    expect(document.querySelector('.__ge_portingRoot')).toBeInTheDocument()
  })

  it('mounts into a DOM element', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount(document.getElementById('mount')!)
    expect(document.querySelector('.__ge_portingRoot')).toBeInTheDocument()
  })
})

describe('updating', () => {
  it('updates the embed', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount('#mount')
    embed.update({})
    expect(document.querySelector('.__ge_portingRoot')).toBeInTheDocument()
  })

  it('fails to update an unmounted embed', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    expect(() => embed.update({})).toThrow(/an unmounted embed/i)
  })
})

describe('unmounting', () => {
  it('unmounts the embed', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount('#mount')
    expect(document.getElementById('mount')).not.toBeEmptyDOMElement()
    embed.unmount()
    expect(document.getElementById('mount')).toBeEmptyDOMElement()
  })

  it('fails to unmount an unmounted embed', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })
    expect(() => embed.unmount()).toThrow(/an unmounted embed/i)
  })
})

describe('initialization', () => {
  it('initializes with valid data', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    expect(embed.mount).toBeDefined()
    expect(embed.update).toBeDefined()
    expect(embed.unmount).toBeDefined()
    expect(embed.on).toBeDefined()
    expect(embed.off).toBeDefined()
  })

  it('throws without a project', async () => {
    const csn = await createFixtures()
    // @ts-expect-error Assume the project is missing in a non-typechecked usage
    const init = PortingEmbed(csn, {})
    expect(init).rejects.toThrow(/NO_PROJECT/)
  })

  it('throws with the wrong ConnectSession', async () => {
    expect(PortingEmbed(null, { project })).rejects.toThrow(/INVALID_SESSION/)
    expect(PortingEmbed({}, { project })).rejects.toThrow(/INVALID_SESSION/)
    expect(PortingEmbed({ secret: 'foo' }, { project })).rejects.toThrow(
      /INVALID_SESSION/,
    )
  })

  it('throws with a wrong intent', async () => {
    const csn = connectSessionFactory
      // @ts-expect-error Unsupported intent type
      .params({ intent: { type: 'foo' } })
      .build()
    const init = PortingEmbed(csn, { project })
    expect(init).rejects.toThrow(/INVALID_SESSION/)
  })

  it('throws with a non-existing subscription', async () => {
    const csn = connectSessionFactory.completePorting('sub_404').build()
    const init = PortingEmbed(csn, { project })
    expect(init).rejects.toThrow(/NOT_FOUND/)
  })

  it('throws without a porting', async () => {
    const sub = await subscriptionFactory.withoutPorting().create()
    const csn = connectSessionFactory.completePorting(sub.id).build()
    const init = PortingEmbed(csn, { project })
    expect(init).rejects.toThrow(/NOT_FOUND/)
  })

  describe('with porting status', () => {
    async function createWithStatus(status: PortingStatus) {
      const porting = portingFactory.params({ status }).build()
      const subscription = await subscriptionFactory
        .associations({ porting })
        .create()
      const connectSession = connectSessionFactory
        .completePorting(subscription.id)
        .build()
      return connectSession
    }

    it('initializes with informationRequired', async () => {
      const csn = await createWithStatus('informationRequired')
      const init = PortingEmbed(csn, { project })
      expect(init).resolves.toBeDefined()
    })

    it('throws with declined', async () => {
      const csn = await createWithStatus('declined')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })

    it('throws with draft', async () => {
      const csn = await createWithStatus('draft')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })

    it('throws with requested', async () => {
      const csn = await createWithStatus('requested')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })

    it('throws with completed', async () => {
      const csn = await createWithStatus('completed')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })

    it('throws with canceled', async () => {
      const csn = await createWithStatus('canceled')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })

    it('throws with expired', async () => {
      const csn = await createWithStatus('expired')
      const init = PortingEmbed(csn, { project })
      expect(init).rejects.toThrow(/UNSUPPORTED/)
    })
  })
})

describe('updating a porting', () => {
  it('fires the submit status event', async () => {
    const user = userEvent.setup()
    const submitStatusEvent = vitest.fn()

    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })
    embed.mount('#mount')
    embed.on('submitStatus', submitStatusEvent)

    await user.type(screen.getByLabelText('Account Number'), '11880')
    await user.type(screen.getByLabelText('Account PIN'), '1337')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(submitStatusEvent).toHaveBeenCalledWith({ status: 'loading' })
    await waitFor(() =>
      expect(submitStatusEvent).toHaveBeenLastCalledWith({
        status: 'success',
        porting: expect.anything(),
      }),
    )
  })

  it('goes through all required steps', async () => {
    const user = userEvent.setup()
    const completedEvent = vitest.fn()

    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })
    embed.mount('#mount')
    embed.on('completed', completedEvent)

    const getCurrentPorting = () => {
      const sub = db.subscriptions.find(
        (s) => s.id === csn.intent.completePorting.subscription,
      )
      const prt = db.portings.find((p) => p.id === sub!.porting!.id)
      return prt
    }

    await user.type(screen.getByLabelText('Account Number'), '11880')
    await user.type(screen.getByLabelText('Account PIN'), '1337')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await screen.findByLabelText('First Name')
    expect(getCurrentPorting()).toMatchObject({
      accountPinExists: true,
      accountNumber: '11880',
      firstName: null,
      lastName: null,
      birthday: null,
      address: null,
      donorProviderApproval: null,
    })

    await user.type(screen.getByLabelText('First Name'), 'first')
    await user.type(screen.getByLabelText('Last Name'), 'last')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await screen.findByLabelText('Line 1')
    expect(getCurrentPorting()).toMatchObject({
      accountPinExists: true,
      accountNumber: '11880',
      firstName: 'first',
      lastName: 'last',
      birthday: null,
      address: null,
      donorProviderApproval: null,
    })

    await user.type(screen.getByLabelText('Line 1'), 'line1')
    await user.type(screen.getByLabelText('City'), 'city')
    await user.type(screen.getByLabelText('Postal Code'), 'pc123')
    await user.type(screen.getByLabelText(/Country/), 'co')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await screen.findByLabelText(/i have notified my current/i)
    expect(getCurrentPorting()).toMatchObject({
      accountPinExists: true,
      accountNumber: '11880',
      firstName: 'first',
      lastName: 'last',
      birthday: null,
      address: {
        line1: 'line1',
        line2: null,
        city: 'city',
        postalCode: 'pc123',
        state: null,
        country: 'CO',
      },
      donorProviderApproval: null,
    })

    await user.click(screen.getByLabelText(/i have notified my current/i))
    expect(screen.getByLabelText(/i have notified my current/i)).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    const finalPorting = {
      accountPinExists: true,
      accountNumber: '11880',
      firstName: 'first',
      lastName: 'last',
      birthday: null,
      address: {
        line1: 'line1',
        line2: null,
        city: 'city',
        postalCode: 'pc123',
        state: null,
        country: 'CO',
      },
      donorProviderApproval: true,
    }

    await waitFor(() => expect(completedEvent).toHaveBeenCalled())

    expect(completedEvent).toHaveBeenCalledOnce()
    expect(completedEvent).toHaveBeenCalledWith({
      porting: expect.objectContaining(finalPorting),
    })
    expect(getCurrentPorting()).toMatchObject(finalPorting)
  })

  it('triggers an error event on error', async () => {
    const user = userEvent.setup()
    const submitStatusEvent = vitest.fn()

    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })
    embed.mount('#mount')
    embed.on('submitStatus', submitStatusEvent)

    // magic string in the mocked http handler
    await user.type(screen.getByLabelText('Account Number'), 'MAGIC_FAIL')
    await user.type(screen.getByLabelText('Account PIN'), '1337')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(submitStatusEvent).toHaveBeenCalledWith({
        status: 'error',
        error: expect.anything(),
      })
    })

    expect(submitStatusEvent.mock.lastCall[0].error).toMatch(
      /FETCH_FAILED: Simulated error/i,
    )
  })
})
