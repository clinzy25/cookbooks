import knex from '../db/db'

export async function dbGetCookbooks(user_guid: string) {
  try {
    return await knex.raw(`
        SELECT
          c.guid,
          u.guid AS creator_user_guid,
          u.email AS creator_user_email,
          u.username AS creator_username,
          c.cookbook_name,
          c.created_at,
          c.updated_at,
          COUNT(DISTINCT r.id) AS recipe_count,
          (COALESCE(ARRAY_AGG(JSONB_BUILD_OBJECT(
            'image', r.image, 
           'base64_image', r.base64_image
          )) FILTER (WHERE r.image IS NOT NULL), '{}'))[1:10] AS recipe_images,
          COALESCE(JSON_AGG(DISTINCT JSONB_BUILD_OBJECT(
            'guid', member_sub.guid, 
            'email', member_sub.email, 
            'username', member_sub.username
          )) FILTER (WHERE member_sub.guid IS NOT NULL), '[]') AS cookbook_members
        FROM cookbooks c
        JOIN users u ON u.id = c.creator_user_id
        LEFT JOIN cookbook_members cm ON cm.cookbook_id = c.id
        LEFT JOIN recipes r ON r.cookbook_id = c.id
        LEFT JOIN LATERAL (
          SELECT u.guid, u.email, u.username, c.id AS cookbook_id
          FROM cookbook_members cm
          JOIN users u ON u.id = cm.member_user_id
          JOIN cookbooks c ON c.id = cm.cookbook_id
          WHERE c.id = cm.cookbook_id
          LIMIT 10
        ) member_sub ON member_sub.cookbook_id = c.id
        WHERE u.guid = '${user_guid}'
        OR cm.cookbook_id = c.id
        GROUP BY 
          c.guid,
          creator_user_guid,
          creator_user_email,
          creator_username,
          c.cookbook_name,
          c.created_at,
          c.updated_at
        ORDER BY c.updated_at DESC
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbCreateCookbook(cookbook_name: string, creator_user_guid: string) {
  try {
    return await knex.raw(`
      INSERT INTO cookbooks(cookbook_name, creator_user_id, created_at, updated_at)
      SELECT '${cookbook_name}' AS cookbook_name, id, ${knex.fn.now()}, ${knex.fn.now()} FROM users
      WHERE users.guid = '${creator_user_guid}'
      RETURNING cookbooks.guid
    `)
  } catch (e) {
    console.error(e)
  }
}

export async function dbUpdateCookbook(cookbook_guid: string, cookbook_name: string) {
  try {
    return await knex('cookbooks')
      .where('guid', '=', cookbook_guid)
      .update({ cookbook_name, updated_at: knex.fn.now() }, ['cookbook_name'])
  } catch (e) {
    console.error(e)
  }
}

export async function dbDeleteCookbook(cookbook_guid: string) {
  try {
    return await knex('cookbooks').where('guid', cookbook_guid).del(['cookbook_name'])
  } catch (e) {
    console.error(e)
  }
}
