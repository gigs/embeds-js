import { Porting, UpdatePortingBody } from '../types'
import { assert } from './assert'

type FetchSubOptions = {
  /** Project id of the porting. */
  project: string
  /** User token. */
  token: string
}

/**
 * Patches the user's porting.
 * @param prt The porting id.
 * @param opts Additional options.
 */
export async function patchPorting(
  prt: string,
  data: UpdatePortingBody,
  opts: FetchSubOptions,
) {
  const res = await fetch(
    `https://api.gigs.com/projects/${opts.project}/portings/${prt}`,
    {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${opts.token}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(data),
    },
  )
  const body = await res.json().catch(() => res.text())
  assert(res.status !== 404, 'PRT_NOT_FOUND: Porting could not be found.')
  assert(res.ok, `FETCH_FAILED: ${body?.message || body?.toString()}`)
  const porting = body as Porting

  return porting
}
