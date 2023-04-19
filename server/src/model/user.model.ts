import knex from '../db/db'

export async function dbGetCookbookMembers(guid: string) {
  try {
    return await knex
      .select(
        'cm.guid as membership_guid',
        'cm.invitation_accepted',
        'cm.created_at',
        'cm.email',
        'u.guid as user_guid',
        'u.username',
        'u.is_readonly'
      )
      .from('cookbook_members as cm')
      .join('cookbooks as c', 'c.id', '=', 'cm.cookbook_id')
      .leftJoin('users as u', 'u.id', '=', 'cm.member_user_id')
      .where({ 'c.guid': guid })
  } catch (e) {
    console.error(e)
  }
}

export async function dbSendInvite(email: string, cookbook_guid: string) {
  try {
    return await knex.raw(`
      INSERT INTO cookbook_members AS cb (cookbook_id, email, created_at, updated_at)
      SELECT c.id, '${email}', ${knex.fn.now()}, ${knex.fn.now()} FROM cookbooks c
      WHERE c.guid = '${cookbook_guid}'
      RETURNING cb.guid
    `)
  } catch (e) {
    console.error(e)
  }
}
