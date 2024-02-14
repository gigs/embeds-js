/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/preact'

import { server } from '../testing/http'

afterEach(() => cleanup())

// Spin up msw http mocks
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())
