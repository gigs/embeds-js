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
  const subscription = await subscriptionFactory.create()
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
    expect(document.querySelector('.__gigsPortingEmbed')).toBeInTheDocument()
  })

  it('mounts into a DOM element', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount(document.getElementById('mount')!)
    expect(document.querySelector('.__gigsPortingEmbed')).toBeInTheDocument()
  })
})

describe('updating', () => {
  it('updates the embed', async () => {
    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })

    embed.mount('#mount')
    embed.update({})
    expect(document.querySelector('.__gigsPortingEmbed')).toBeInTheDocument()
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
  it('sends the updated data', async () => {
    const user = userEvent.setup()
    const updatedFn = vitest.fn()

    const csn = await createFixtures()
    const embed = await PortingEmbed(csn, { project })
    embed.mount('#mount')
    embed.on('portingUpdated', updatedFn)

    await user.type(screen.getByLabelText('Account Number'), '11880')
    await user.type(screen.getByLabelText('Account PIN'), '1337')
    await user.type(screen.getByLabelText('Birthday'), '01.01.1990')
    await user.type(screen.getByLabelText('First Name'), 'Jane')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(updatedFn).toHaveBeenCalled())

    const sub = db.subscriptions.find(
      (s) => s.id === csn.intent.completePorting.subscription,
    )
    const prt = db.portings.find((p) => p.id === sub!.porting!.id)

    expect(prt).toMatchObject({
      accountPinExists: true,
      accountNumber: '11880',
      birthday: '01.01.1990',
      firstName: 'Jane',
      lastName: 'Doe',
    })
  })
})
