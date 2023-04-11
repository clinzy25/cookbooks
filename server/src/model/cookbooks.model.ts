import knex from '../db/db'

export async function getCookbook(guid: string) {
  try {
    return await knex('cookbooks')
      .join('users', 'users.id', '=', 'cookbooks.id')
      .where({ 'users.guid': guid })
  } catch (error) {
    console.error(error)
  }
}

// .where({
//       guid,
//     })
