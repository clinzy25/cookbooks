import { Knex } from 'knex';
import fs from 'fs';
import path from 'path';

const getRecipe = (fileName: string): string => {
  const file = path.join(__dirname, 'recipes', fileName);
  return JSON.stringify(fs.readFileSync(file, 'utf8'));
};

export async function seed(knex: Knex): Promise<void> {
  await knex.raw(
    'TRUNCATE TABLE users, cookbook_members, invites, cookbooks, recipes, ingredients, ingredient_types, instructions, notes, tags, tag_types RESTART IDENTITY;'
  );

  await knex('users').insert([
    {
      username: 'clinzy',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      username: 'qnt3n',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      username: 'curbins',
      email: 'email@email.com',
      password: 'asdfabisdfybiasfgd',
      is_readonly: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
  await knex('cookbooks').insert([
    {
      creator_user_id: 1,
      cookbook_name: 'Conner shared cookbook',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      creator_user_id: 1,
      cookbook_name: 'Quinten family cookbook',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
  await knex('cookbook_members').insert([
    {
      creator_user_id: 1,
      member_user_id: 2,
      cookbook_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      creator_user_id: 1,
      member_user_id: 2,
      cookbook_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      creator_user_id: 1,
      member_user_id: 3,
      cookbook_id: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
  await knex('recipes').insert([
    {
      cookbook_id: 1,
      user_id: 1,
      recipe_name: 'Korean beef bowls',
      image:
        'https://therealfooddietitians.com/wp-content/uploads/2022/05/Korean-Beef-Bowls-2.jpg',
      source:
        'https://therealfooddietitians.com/korean-inspired-ground-beef-bowls/',
      source_type: 'form',
      description:
        'These Korean-inspired beef bowls are packed with flavor, protein, and color and ready in under 30 minutes.',
      servings: 4,
      prep_time: '15 minutes',
      cook_time: '10 minutes',
      author_name: 'therealfooddietitians',
      is_private: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      cookbook_id: 1,
      user_id: 1,
      recipe_name: '30-Minute Tofu Pad Thai',
      image:
        'https://www.simplyquinoa.com/wp-content/uploads/2022/01/30-minute-tofu-pad-thai-2-500x500.jpg',
      source: 'https://www.simplyquinoa.com/30-minute-tofu-pad-thai/',
      source_type: 'form',
      description:
        'This super easy tofu pad thai recipe takes 30 minutes, is healthy, gluten-free and vegetarian. It tastes like takeout, but without any junk! Made with egg, peanut butter and coconut sugar!',
      servings: 4,
      prep_time: '25 minutes',
      cook_time: '30 minutes',
      author_name: 'Alyssa',
      is_private: 1,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      cookbook_id: 1,
      user_id: 2,
      recipe_name: 'Italian Wedding Soup',
      image:
        'https://howtofeedaloon.com/wp-content/uploads/2020/09/wedding-instagram-500x500.jpg',
      source: 'https://howtofeedaloon.com/italian-wedding-soup/',
      source_type: 'form',
      description:
        "This Italian Wedding Soup is the perfect marriage of veggies and meat. It will warm you to the bone and make you smile with every satisfying bite! Perfect for when loved one's are coming to visit!",
      servings: 4,
      prep_time: '25 minutes',
      cook_time: '30 minutes',
      author_name: 'Kris Longwell',
      is_private: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      cookbook_id: 1,
      user_id: 2,
      recipe_name: 'Authentic Jambalaya',
      source:
        'https://howtofeedaloon.com/authentic-jambalaya-shrimp-chicken-smoked-ham/',
      recipe_body: getRecipe('jumbalaya.json'),
      source_type: 'link',
      is_private: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      cookbook_id: 1,
      user_id: 1,
      recipe_name: 'Slow-Cooker Chicken Chow Mein',
      source:
        'https://howtofeedaloon.com/slow-cooker-chicken-chow-mein-recipe/',
      recipe_body: getRecipe('chow_mein.json'),
      source_type: 'link',
      is_private: 0,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
  await knex('ingredient_types').insert([
    { ingredient_name: 'rice noodles' },
    { ingredient_name: 'bean sprouts' },
    { ingredient_name: 'soy sauce' },
    { ingredient_name: 'shredded carrots' },
    { ingredient_name: 'eggs' },
    { ingredient_name: 'meatballs' },
    { ingredient_name: 'pasta dried, such as dilatini or small elbow' },
    { ingredient_name: 'sea salt and black pepper' },
    { ingredient_name: 'ground beef' },
    { ingredient_name: 'ginger' },
    { ingredient_name: 'gochujang' },
  ]);
  await knex('ingredients').insert([
    {
      ingredient_type_id: 1,
      recipe_id: 2,
      amount: 14,
      unit: 'oz',
    },
    {
      ingredient_type_id: 2,
      recipe_id: 1,
      amount: 1,
      unit: 'cup',
    },
    {
      ingredient_type_id: 3,
      recipe_id: 2,
      amount: 2,
      unit: 'tbsp',
    },
    {
      ingredient_type_id: 4,
      recipe_id: 2,
      amount: 1,
      unit: 'cup',
    },
    {
      ingredient_type_id: 4,
      recipe_id: 1,
      amount: 0.5,
      unit: 'cup',
    },
    {
      ingredient_type_id: 6,
      recipe_id: 3,
      amount: 1,
      unit: 'tray',
    },
    {
      ingredient_type_id: 7,
      recipe_id: 3,
      amount: 1,
      unit: 'lb',
    },
    {
      ingredient_type_id: 8,
      recipe_id: 1,
      amount: 2,
      unit: 'tbsp',
    },
    {
      ingredient_type_id: 9,
      recipe_id: 1,
      amount: 1,
      unit: 'tsp',
    },
  ]);
  await knex('instructions').insert([
    {
      recipe_id: 1,
      order: 1,
      instruction_body:
        'Place a medium or large skillet over medium-high heat on the stovetop. When the skillet is hot, add the ground beef to the skillet, stirring and crumbling into small pieces with a wooden spoon, until cooked through. Drain off any excess liquid then return the skillet to the stove.',
    },
    {
      recipe_id: 1,
      order: 2,
      instruction_body:
        'While the beef is cooking, in a small bowl, whisk together the coconut aminos, honey, sesame oil, rice vinegar, garlic, red pepper flakes, and ginger. ',
    },
    {
      recipe_id: 2,
      order: 1,
      instruction_body:
        'Begin by cooking the noodles according to the package instructions. Drain once cooked.',
    },
    {
      recipe_id: 2,
      order: 2,
      instruction_body:
        'While the noodles are cooking, cut the tofu into cubes. Heat the oil in a large pan and place the tofu in the pan. Sear for 2 – 3 minutes per side. Once the tofu is seared, transfer it to a plate.',
    },
    {
      recipe_id: 3,
      order: 1,
      instruction_body:
        'In a large bowl, combine the beef, Italian sausage, eggs, onion, garlic, bread crumbs, cheese, and 1 teaspoon of salt and pepper (each). Mix until fully combined. ',
    },
    {
      recipe_id: 3,
      order: 2,
      instruction_body:
        'Moisten hands and shape medium-small meatballs. Place them on a platter.',
    },
  ]);
  await knex('notes').insert([
    {
      recipe_id: 2,
      note_body:
        'May substitute 3 tablespoons tamari (gluten-free) or low-sodium soy sauce + 3 tablespoons water for coconut aminos, if desired',
    },
    {
      recipe_id: 3,
      note_body:
        'The broth can be made up to 4 days in advance.  It can be frozen for up to 2 months.',
    },
  ]);
  await knex('tag_types').insert([
    {
      tag_name: 'Asian',
    },
    {
      tag_name: 'Italian',
    },
    {
      tag_name: 'Jamacian',
    },
    {
      tag_name: 'Vegitarian',
    },
    {
      tag_name: 'Chicken',
    },
  ]);
  await knex('tags').insert([
    {
      recipe_id: 1,
      tag_type_id: 1,
    },
    {
      recipe_id: 2,
      tag_type_id: 1,
    },
    {
      recipe_id: 2,
      tag_type_id: 5,
    },
    {
      recipe_id: 3,
      tag_type_id: 2,
    },
    {
      recipe_id: 4,
      tag_type_id: 3,
    },
    {
      recipe_id: 5,
      tag_type_id: 5,
    },
  ]);
}
