import { http, HttpHandler, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

import { UpdatePortingBody } from '../lib/types'
import { db } from './db'

export const handlers: HttpHandler[] = [
  http.get('https://api.example.com/users/:id', () => {
    return HttpResponse.json({ name: 'George' })
  }),

  http.get<{ project: string; id: string }>(
    'https://api.gigs.com/projects/:project/subscriptions/:id',
    async ({ params }) => {
      const sub = db.subscriptions.find((sub) => sub.id === params.id)

      if (!sub) {
        return HttpResponse.json(
          { object: 'error', type: 'notFound' },
          { status: 404 },
        )
      }

      return HttpResponse.json(sub)
    },
  ),

  http.patch<{ project: string; id: string }, UpdatePortingBody>(
    'https://api.gigs.com/projects/:project/portings/:id',
    async ({ params, request }) => {
      const prt = db.portings.find((prt) => prt.id === params.id)

      if (!prt) {
        return HttpResponse.json(
          { object: 'error', type: 'notFound' },
          { status: 404 },
        )
      }

      const body = await request.json()

      if (body.accountNumber === 'MAGIC_FAIL') {
        return HttpResponse.json(
          { message: 'Simulated error' },
          { status: 422 },
        )
      }

      const newPrt = {
        ...prt,
        ...body,
      }

      if (newPrt.accountPin) {
        newPrt.accountPinExists = true
        delete newPrt.accountPin
      }

      const index = db.portings.findIndex((prt) => prt.id === params.id)
      db.portings[index] = newPrt

      return HttpResponse.json(newPrt)
    },
  ),

  http.post<never, { secret: string }>(
    'https://connect.gigs.com/api/embeds/auth',
    async ({ request }) => {
      const body = await request.json()
      if (!body.secret) {
        return HttpResponse.json({ error: 'No secret.' }, { status: 422 })
      }

      if (body.secret === 'expired') {
        return HttpResponse.json({ error: 'Invalid secret.' }, { status: 422 })
      }

      return HttpResponse.json({
        token: { access_token: `exchanged:${body.secret}` },
      })
    },
  ),
]

export const server = setupServer(...handlers)
export { http, HttpResponse }
