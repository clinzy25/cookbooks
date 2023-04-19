import knex from '../db/db'

type Guids = {
  cookbook_guid: string
  user_guid: string
  invite_guid: string
}

export async function dbCreateInvite(guids: Guids) {
  const { cookbook_guid, user_guid, invite_guid } = guids

  try {
    return await knex.raw(`
      INSERT INTO invites(guid, sender_user_id, cookbook_id)
      SELECT '${invite_guid}', u.id, c.id FROM users u
      JOIN cookbooks c on c.guid = '${cookbook_guid}'
      WHERE u.guid = '${user_guid}'
      RETURNING '${invite_guid}'
    `)
  } catch (e) {
    console.error(e)
  }
}
