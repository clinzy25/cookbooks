import knex from '../db/db'

export async function getCookbook(id: number) {
  try {
    return await knex('cookbooks').where({
      id,
    })
  } catch (error) {
    console.error(error)
  }
}
