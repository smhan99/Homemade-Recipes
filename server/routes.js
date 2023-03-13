const config = require("./config.json");
const mysql = require("mysql");
const e = require("express");

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
});
connection.connect();

// Route 1 - gets all restaurants in the specified city
async function all_restaurants(req, res) {
  var city = req.query.city ? req.query.city : "";
  connection.query(
    `SELECT restaurant_id, restaurant_name, restaurant_location, restaurant_phone
    FROM Restaurants 
    WHERE restaurant_location LIKE '%${city}%'`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}
// Route 2 - gets information of a restaurant specified by an id
async function restaurant(req, res) {
  var id = req.query.id ? req.query.id : 0;
  connection.query(
    `
    SELECT r.restaurant_id, restaurant_name, restaurant_location, restaurant_phone,
      GROUP_CONCAT(category_name SEPARATOR ', ') as categories
    FROM Restaurants r
    JOIN RestaurantTypes RT on r.restaurant_id = RT.restaurant_id
    JOIN Categories C on C.category_id = RT.category_id
    WHERE r.restaurant_id = '${id}'
    GROUP BY restaurant_id, restaurant_name, restaurant_location
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        connection.query(
          `
          SELECT m.menuitem_id, menuitem_name, menuitem_category
          FROM Menuitems m
          JOIN RestaurantServes RS on m.menuitem_id = RS.menuitem_id
          WHERE restaurant_id = '${id}'
          ORDER BY menuitem_category
          `,
          function (error2, results2, fields2) {
            if (error2) {
              console.log(error2);
              res.json({ error: error2 });
            } else if (results2) {
              results[0]["menuitems"] = results2;
              res.json({ results: results });
            }
          }
        );
      }
    }
  );
}

// Route 3 - gets restaurants based on search criteria of name, location,
// cuisine, and phone area code
async function search_restaurants(req, res) {
  var name = req.query.name ? req.query.name : "";
  var location = req.query.location ? req.query.location : "";
  var cuisine = req.query.cuisine ? req.query.cuisine : "";
  var phone_ac = req.query.phone ? `(${req.query.phone})` : "";
  connection.query(
    `
    SELECT DISTINCT R.restaurant_id, R.restaurant_name, 
    R.restaurant_location, R.restaurant_phone
    FROM Restaurants R JOIN RestaurantTypes T ON R.restaurant_id = T.restaurant_id
    JOIN Categories C ON T.category_id = C.category_id
    WHERE R.restaurant_name LIKE '%${name}%' AND R.restaurant_location LIKE '%${location}%'
    AND C.category_name LIKE '%${cuisine}%' AND R.restaurant_phone LIKE '%${phone_ac}%'
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 4 - gets the first 10000 recipes
async function many_recipes(req, res) {
  connection.query(
    `
    SELECT id, title, url
    FROM Recipes
    LIMIT 10000
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 5 - gets information of a recipe specified by an id
async function recipe(req, res) {
  var id = req.query.id ? req.query.id : "";
  connection.query(
    `
    SELECT title AS recipe_title, ingredients AS recipe_ingredients, 
    instructions AS recipe_instructions, url AS recipe_url
    FROM Recipes
    WHERE id = '${id}'
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 6 - gets recipes based on search criteria of name
async function search_recipes(req, res) {
  var name = req.query.name ? req.query.name : "";
  connection.query(
    `
    SELECT id, title, url
    FROM Recipes
    WHERE title LIKE '%${name}%'
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 7 - gets information about menuitems and its matched recipes
// specified by an menuitem id
async function menu_item(req, res) {
  var id = req.query.id ? req.query.id : 0;
  connection.query(
    `
    SELECT menuitem_name
    FROM Menuitems
    WHERE menuitem_id = '${id}'
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        connection.query(
          `
          SELECT id, title, url
          FROM Recipes R JOIN MenuitemRecipeSim MRS on R.id = MRS.recipe_id
          WHERE menuitem_id = '${id}'
          ORDER BY sim_score DESC
          `,
          function (error, results2, fields) {
            if (error) {
              console.log(error);
              res.json({ error: error });
            } else if (results2) {
              results[0]["recipes"] = results2;
              res.json({ results: results });
            }
          }
        );
      }
    }
  );
}

// Route 8 - gets the recipes saved by a user using the user id
async function my_recipe(req, res) {
  var id = req.query.id;
  connection.query(
    `
    SELECT R.id, R.title, R.url
    FROM Accounts A JOIN AccountRecipe AR ON A.id = AR.account_id JOIN 
    Recipes R ON AR.recipe_id = R.id
    WHERE A.id = ${id}
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 9 - gets the restaurants saved by a user using the user id
async function my_restaurant(req, res) {
  var id = req.query.id;
  connection.query(
    `
    SELECT R.restaurant_id, R.restaurant_name, R.restaurant_location, R.restaurant_phone
    FROM Accounts A JOIN AccountRestaurant AR ON A.id = AR.account_id
    JOIN Restaurants R ON AR.restaurant_id = R.restaurant_id
    WHERE A.id = ${id}
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 10 - gets all saved recipes that are also matched with
// some menu items in the restaurants I saved
async function my_favorite(req, res) {
  var id = req.query.id;
  connection.query(
    `
    WITH saved_recipe AS (
        SELECT recipe_id
        FROM AccountRecipe R JOIN Accounts A ON R.account_id = A.id
        WHERE A.id = ${id}
    ),
    liked_restaurants AS (
        SELECT l.restaurant_id
        FROM AccountRestaurant l JOIN Restaurants r ON l.restaurant_id = r.restaurant_id
        JOIN Accounts A ON l.account_id = A.id
        WHERE A.id = ${id}
    ),
    recipes_from_liked AS (
        SELECT m.menuitem_id, s.restaurant_id
        FROM RestaurantServes s
        JOIN liked_restaurants r ON s.restaurant_id = r.restaurant_id
        JOIN Menuitems m ON s.menuitem_id = m.menuitem_id
    ),
    Liked_and_saved AS (
        SELECT h.recipe_id, r.restaurant_id
        FROM recipes_from_liked r
        JOIN MenuitemRecipeSim h ON r.menuitem_id = h.menuitem_id
    )
    SELECT DISTINCT r.id, r.title, rest.restaurant_id, rest.restaurant_name
    FROM Liked_and_saved l 
    JOIN saved_recipe s ON l.recipe_id = s.recipe_id
    JOIN Recipes r ON l.recipe_id = r.id
    JOIN Restaurants rest on l.restaurant_id = rest.restaurant_id`,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 11 - gets all restaurant names located in the zip code where I live
// and are in the category of “late night” or “dinner”
async function restaurants_nearby(req, res) {
  var id = req.query.id;
  connection.query(
    `
    WITH location AS (
      SELECT A.zipcode AS zipcode
      FROM Accounts A
      WHERE A.id = ${id}
    ), 
    nearby_restaurants AS (
      SELECT R.restaurant_id, R.restaurant_name
      FROM Restaurants R JOIN location L ON R.restaurant_location 
      LIKE CONCAT('%', L.zipcode, '%')      
    )
    SELECT DISTINCT R.restaurant_id, R.restaurant_name
    FROM nearby_restaurants R JOIN RestaurantTypes T ON R.restaurant_id = T.restaurant_id
    JOIN Categories C ON T.category_id = C.category_id
    WHERE C.category_name = 'Dinner' OR C.category_name = 'Late Night'
    ORDER BY R.restaurant_name
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 12 - sorts the categories of restaurants in order of the number of menu items
// in the restaurant that have at least three recipes matched to it.
async function popular_categories(req, res) {
  connection.query(
    `
    WITH gt_three AS (
        SELECT menuitem_id, count(menuitem_id) AS count
        FROM MenuitemRecipeSim
        GROUP BY menuitem_id
        HAVING count(menuitem_id) > 2
    ), 
    rest_categories AS (
        SELECT ht.category_id, g.menuitem_id
        FROM RestaurantServes s JOIN gt_three g ON s.menuitem_id = g.menuitem_id
        JOIN RestaurantTypes ht ON s.restaurant_id = ht.restaurant_id
    )
    SELECT C.category_name, count(C.category_name) AS count
    FROM rest_categories R JOIN Categories C ON R.category_id = C.category_id
    GROUP BY category_name
    ORDER BY count DESC
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 13 - sorts my saved restaurants based on the number of matching recipes
// each restaurant has with its menu items with similarity score above 0.7
async function my_restaurants_recipes(req, res) {
  var id = req.query.id;
  connection.query(
    `
    WITH my_restaurants AS (
        SELECT R.restaurant_id, R.restaurant_name, R.restaurant_location, R.restaurant_phone
        FROM Accounts A JOIN AccountRestaurant AR ON A.id = AR.account_id
        JOIN Restaurants R ON AR.restaurant_id = R.restaurant_id
        WHERE A.id = ${id}
    ),
    my_restaurants_menus AS (
        SELECT M.restaurant_id, M.restaurant_name, M.restaurant_location, 
        M.restaurant_phone, S.menuitem_id
        FROM my_restaurants M JOIN RestaurantServes S ON M.restaurant_id = S.restaurant_id
    )
    SELECT M.restaurant_id, M.restaurant_name, M.restaurant_location, M.restaurant_phone
    FROM my_restaurants_menus M JOIN MenuitemRecipeSim S ON M.menuitem_id = S.menuitem_id
    WHERE S.sim_score >= 0.7
    GROUP BY M.restaurant_id, M.restaurant_name, M.restaurant_location, M.restaurant_phone
    ORDER BY COUNT(*) DESC
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 14 - validates login info using the email and password provided
async function login_info(req, res) {
  var email = req.query.email;
  var password = req.query.password;
  connection.query(
    `
    SELECT id, email
    FROM Accounts
    WHERE email = '${email}' AND password = '${password}'
    `,
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 15 - registers a user using the email, password, name, state, and
// zipcode provided
async function registration_info(req, res) {
  var email = req.query.email;
  var password = req.query.password;
  var name = req.query.name ? req.query.name : null;
  var state = req.query.state ? req.query.state : null;
  var zipcode = req.query.zipcode ? req.query.zipcode : null;
  const values = [[email, name, state, zipcode, password]];
  connection.query(
    `
    INSERT INTO Accounts(email, name, state, zipcode, password)
    VALUES ?
    `,
    [values],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 16 - saves a restaurant or a list of restaurants to a user's profile
async function add_user_restaurants(req, res) {
  var user_id = req.query.user_id;
  var restaurant_ids = req.query.restaurant_id;
  var values = [];
  if (typeof restaurant_ids == "string") {
    values = [[parseInt(user_id), parseInt(restaurant_ids)]];
  } else {
    for (let i = 0; i < restaurant_ids.length; i++) {
      values.push([parseInt(user_id), parseInt(restaurant_ids[i])]);
    }
  }
  connection.query(
    `
    INSERT IGNORE INTO AccountRestaurant(account_id, restaurant_id)
    VALUES ?
    `,
    [values],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 16 - saves a recipe or a list of recipes to a user's profile
async function add_user_recipes(req, res) {
  var user_id = req.query.user_id;
  var recipe_ids = req.query.recipe_id;
  var values = [];
  if (typeof recipe_ids == "string") {
    values = [[parseInt(user_id), recipe_ids]];
  } else {
    for (let i = 0; i < recipe_ids.length; i++) {
      values.push([parseInt(user_id), recipe_ids[i]]);
    }
  }
  connection.query(
    `
    INSERT IGNORE INTO AccountRecipe(account_id, recipe_id)
    VALUES ?
    `,
    [values],
    function (error, results, fields) {
      if (error) {
        console.log(error);
        res.json({ error: error });
      } else if (results) {
        res.json({ results: results });
      }
    }
  );
}

// Route 17 - deletes a restaurant or a list of restaurants from a user's profile
async function delete_user_restaurants(req, res) {
  var user_id = req.query.user_id;
  var restaurant_ids = req.query.restaurant_id;
  var query = `DELETE FROM AccountRestaurant WHERE account_id = ${user_id} AND `;
  if (typeof restaurant_ids == "string") {
    query += `restaurant_id = ${restaurant_ids}`;
  } else {
    for (let i = 0; i < restaurant_ids.length; i++) {
      if (i == 0) {
        query += `(restaurant_id = ${restaurant_ids[i]} OR `;
      } else if (i == restaurant_ids.length - 1) {
        query += `restaurant_id = ${restaurant_ids[i]})`;
      } else {
        query += `restaurant_id = ${restaurant_ids[i]} OR `;
      }
    }
  }
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

// Route 18 - deletes a recipe or a list of recipes from a user's profile
async function delete_user_recipes(req, res) {
  var user_id = req.query.user_id;
  var recipe_ids = req.query.recipe_id;
  var query = `DELETE FROM AccountRecipe WHERE account_id = ${user_id} AND `;
  if (typeof recipe_ids == "string") {
    query += `recipe_id = '${recipe_ids}'`;
  } else {
    for (let i = 0; i < recipe_ids.length; i++) {
      if (i == 0) {
        query += `(recipe_id = '${recipe_ids[i]}' OR `;
      } else if (i == recipe_ids.length - 1) {
        query += `recipe_id = '${recipe_ids[i]}')`;
      } else {
        query += `recipe_id = '${recipe_ids[i]}' OR `;
      }
    }
  }
  connection.query(query, function (error, results, fields) {
    if (error) {
      console.log(error);
      res.json({ error: error });
    } else if (results) {
      res.json({ results: results });
    }
  });
}

module.exports = {
  all_restaurants,
  restaurant,
  search_restaurants,
  many_recipes,
  recipe,
  search_recipes,
  menu_item,
  my_recipe,
  my_restaurant,
  my_favorite,
  restaurants_nearby,
  popular_categories,
  my_restaurants_recipes,
  login_info,
  registration_info,
  add_user_restaurants,
  add_user_recipes,
  delete_user_restaurants,
  delete_user_recipes,
};
