import React from "react";
import { Table, Button, Row, Col } from "antd";
import { Form, FormInput, FormGroup } from "shards-react";

import MenuBar from "../components/MenuBar";
import { getManyRecipes, searchRecipe, addMyRecipes } from "../fetcher";

const recipeColumns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    sorter: (a, b) => a.title.localeCompare(b.title),
    render: (text, row) => <a href={`/recipe?id=${row.id}`}>{text}</a>,
  },
  {
    title: "Link",
    dataIndex: "url",
    key: "url",
    render: (text, row) => <a href={`${text}`}>{text}</a>,
  },
];

class RecipesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recipeResults: [],
      pagination: null,
      searchedRecipeName: "",
      selectedRecipes: [],
      recipeResults: [],
    };

    this.handleRecipeNameChange = this.handleRecipeNameChange.bind(this);
    this.addUserRecipes = this.addUserRecipes.bind(this);
    this.onSelectRecipeChange = this.onSelectRecipeChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
  }

  handleRecipeNameChange(event) {
    this.setState({ searchedRecipeName: event.target.value });
  }

  addUserRecipes(recipe_ids) {
    const user_id = sessionStorage.getItem("id");
    if (recipe_ids.length > 0) {
      addMyRecipes(user_id, recipe_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  onSelectRecipeChange(selectedRowKeys) {
    this.setState({ selectedRecipes: selectedRowKeys });
  }

  updateSearchResults() {
    searchRecipe(this.state.searchedRecipeName).then((res) => {
      this.setState({ recipeResults: res.results });
    });
  }

  componentDidMount() {
    getManyRecipes().then((res) => {
      this.setState({ recipeResults: res.results });
    });
  }

  render() {
    const logged_in = sessionStorage.getItem("id") !== null;
    const selectedRecipeKeys = this.state.selectedRecipes;
    return (
      <div>
        <MenuBar />
        <Form style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <Row>
            <Col flex={2}>
              <FormGroup
                style={{ width: "40vw", margin: "0 auto", marginRight: "2vh" }}
              >
                <label>Name</label>
                <FormInput
                  placeholder="Name"
                  value={this.state.searchedRecipeName}
                  onChange={this.handleRecipeNameChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginTop: "5vh" }}
                  onClick={this.updateSearchResults}
                >
                  Search
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Recipes</h3>
          {logged_in && (
            <div style={{ marginTop: "2vh" }}>
              <Button
                type="primary"
                onClick={() => {
                  this.addUserRecipes(this.state.selectedRecipes);
                }}
              >
                Add
              </Button>
              <Table
                dataSource={this.state.recipeResults}
                columns={recipeColumns}
                rowKey="id"
                pagination={{
                  pageSizeOptions: [10, 20],
                  defaultPageSize: 10,
                  showQuickJumper: true,
                }}
                rowSelection={{
                  selectedRecipeKeys,
                  onChange: this.onSelectRecipeChange,
                }}
              />
            </div>
          )}
          {!logged_in && (
            <Table
              dataSource={this.state.recipeResults}
              columns={recipeColumns}
              rowKey="id"
              pagination={{
                pageSizeOptions: [10, 20],
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default RecipesPage;
