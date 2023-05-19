import { Knex } from 'knex'
import axios from 'axios'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '..', '.env'),
})

export async function seed(knex: Knex): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    await knex.raw(
      'TRUNCATE TABLE users, cookbook_members, cookbooks, recipes, tags RESTART IDENTITY;'
    )

    await knex('users').insert([
      {
        guid: 'auth0|64372a666cf43922a23a8e31',
        username: 'clinzy',
        email: 'email@email.com',
        password: 'asdfabisdfybiasfgd',
        is_readonly: 0,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        guid: 'auth0|64372a666cf43922a23a8e32',
        username: 'qnt3n',
        email: 'email@email.com',
        password: 'asdfabisdfybiasfgd',
        is_readonly: 0,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        guid: 'auth0|64372a666cf43922a23a8e33',
        username: 'curbins',
        email: 'email@email.com',
        password: 'asdfabisdfybiasfgd',
        is_readonly: 1,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
    ])
    await knex('cookbooks').insert([
      {
        creator_user_id: 1,
        cookbook_name: 'Conner shared cookbook',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
      {
        creator_user_id: 2,
        cookbook_name: 'Quinten family cookbook',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
    ])
    await knex('cookbook_members').insert([
      {
        member_user_id: 1,
        cookbook_id: 2,
        email: 'email@email.com',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
        invitation_accepted: 1,
      },
      {
        member_user_id: 3,
        cookbook_id: 1,
        email: 'email@email.com',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
    ])
    const cookbook_guids = await knex.select('guid').from('cookbooks')
    const recipes = [
      {
        url: 'https://howtofeedaloon.com/chicken-and-rice-casserole-with-broccoli-and-cheese/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/banh-mi/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/fresh-spinach-pasta/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/authentic-jambalaya-shrimp-chicken-smoked-ham/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/slow-cooker-chicken-chow-mein-recipe/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/extra-crispy-sesame-beef/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/best-creamy-tuscan-chicken/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/halibut-braised-kale-beans-tomatoes/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/fried-oyster-b-l-t/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/spinach-ramen-noodle-soup-poached-egg/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/pozole-rojo-pork-and-hominy-stew/',
        cookbook_guid: cookbook_guids[0].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/classic-homemade-chicken-noodle-soup/',
        cookbook_guid: cookbook_guids[1].guid,
        source_type: 'link',
        is_private: 0,
      },
      {
        url: 'https://howtofeedaloon.com/deep-dish-italian-sausage-and-broccoli-rabe-pizza/',
        cookbook_guid: cookbook_guids[1].guid,
        source_type: 'link',
        is_private: 0,
      },
    ]
    await axios.post(`http://localhost:8080/v1/recipes/parse`, { recipes })
  }
}
