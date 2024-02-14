import { http, HttpHandler, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const handlers: HttpHandler[] = [
  http.get('https://api.example.com/users/:id', () => {
    return HttpResponse.json({ name: 'George' })
  }),
]

export const server = setupServer(...handlers)
export { http, HttpResponse }
