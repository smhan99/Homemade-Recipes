import React from "react";

import MenuBar from "../components/MenuBar";
import { getRecipe } from "../fetcher";
import { Button } from "shards-react";
import { addMyRecipes } from "../fetcher";

class RecipePage extends React.Component {
  constructor(props) {
    super(props);

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    this.state = {
      recipeResult: null,
      selectedRecipeId: params ? params.id : 0,
      pagination: null,
      ingredients: [],
      instructions: [],
      url: "",
    };

    this.goToUrl = this.goToUrl.bind(this);
    this.addUserRecipes = this.addUserRecipes.bind(this);
  }
  goToUrl() {
    window.location = this.state.url;
  }

  addUserRecipes() {
    const user_id = sessionStorage.getItem("id");
    console.log(this.state.selectedRecipeId);
    addMyRecipes(user_id, [this.state.selectedRecipeId]).then((res) => {
      window.location.reload();
    });
  }

  componentDidMount() {
    getRecipe(this.state.selectedRecipeId).then((res) => {
      this.setState({ recipeResult: res.results[0] }, () => {
        var ingredients_arr = [];
        var instructions_arr = [];
        var ing = eval(res.results[0].recipe_ingredients);
        var ins = eval(res.results[0].recipe_instructions);
        for (var each in ing) {
          ingredients_arr.push(<p>{ing[each].text}</p>);
        }
        for (var each in ins) {
          instructions_arr.push(<p>{ins[each].text}</p>);
        }
        this.setState({ ingredients: ingredients_arr });
        this.setState({ instructions: instructions_arr });
        this.setState({ url: res.results[0].recipe_url });
      });
    });
  }

  render() {
    const logged_in = sessionStorage.getItem("id") !== null;
    return (
      <div style={{ paddingBottom: "15vh" }}>
        <MenuBar />
        {this.state.recipeResult ? (
          <div style={{ width: "70vw", margin: "auto", textAlign: "center" }}>
            <h3 style={{ marginTop: "5vh" }}>
              {this.state.recipeResult.recipe_title}
            </h3>
            <Button
              style={{ height: "25px", width: "100px", padding: "3px" }}
              onClick={this.goToUrl}
            >
              Website link
            </Button>
            {logged_in && (
              <Button
                style={{
                  height: "25px",
                  width: "100px",
                  padding: "3px",
                  marginLeft: "2vw",
                }}
                onClick={this.addUserRecipes}
              >
                Save
              </Button>
            )}
            <h4 style={{ marginTop: "10vh" }}>Ingredients</h4>
            {this.state.ingredients}
            <h4 style={{ marginTop: "15vh" }}>Instructions</h4>
            {this.state.instructions}
          </div>
        ) : null}
      </div>
    );
  }
}

export default RecipePage;
