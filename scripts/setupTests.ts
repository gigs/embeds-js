/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/preact'

afterEach(() => cleanup())
