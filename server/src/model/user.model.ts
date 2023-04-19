import knex from '../db/db'

export async function dbGetCookbookMembers(guid: string) {
  try {
    return await knex
      .select(
        'cm.guid as membership_guid',
        'cm.invitation_accepted',
        'cm.created_at',
        'u.guid as user_guid',
        'u.username',
        'u.email',
        'u.is_readonly'
      )
      .from('cookbook_members as cm')
      .join('cookbooks as c', 'c.id', '=', 'cm.cookbook_id')
      .join('users as u', 'u.id', '=', 'cm.member_user_id')
      .where({ 'c.guid': guid })
  } catch (e) {
    console.error(e)
  }
}
