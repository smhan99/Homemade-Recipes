import React from "react";
import { Table, Button } from "antd";
import MenuBar from "../components/MenuBar";
import {
  getMyRestaurants,
  getMyRecipes,
  getMyRestaurantsRecipes,
  deleteMyRestaurants,
  deleteMyRecipes,
  getMyFavorites,
} from "../fetcher";

const restaurantColumns = [
  {
    title: "Name",
    dataIndex: "restaurant_name",
    key: "restaurant_name",
    sorter: (a, b) => a.restaurant_name.localeCompare(b.restaurant_name),
    render: (text, row) => (
      <a href={`/restaurant?id=${row.restaurant_id}`}>{text}</a>
    ),
  },
  {
    title: "Address",
    dataIndex: "restaurant_location",
    key: "restaurant_location",
  },
  {
    title: "Phone Number",
    dataIndex: "restaurant_phone",
    key: "restaurant_phone",
  },
];

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

const favoriteColumns = [
  {
    title: "Recipe Name",
    dataIndex: "title",
    key: "title",
    render: (text, row) => <a href={`/recipe?id=${row.id}`}>{text}</a>,
  },
  {
    title: "Restaurant Name",
    dataIndex: "restaurant_name",
    key: "restaurant_name",
    render: (text, row) => (
      <a href={`/restaurant?id=${row.restaurant_id}`}>{text}</a>
    ),
  },
];

class MyPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantsResults: [],
      recipeResults: [],
      selectedRestaurants: [],
      selectedRecipes: [],
      favoriteResults: [],
    };

    this.getRestaurantsByRecipeCount =
      this.getRestaurantsByRecipeCount.bind(this);
    this.onSelectRestaurantChange = this.onSelectRestaurantChange.bind(this);
    this.onSelectRecipeChange = this.onSelectRecipeChange.bind(this);
  }

  componentDidMount() {
    const id = sessionStorage.getItem("id");
    getMyRestaurants(id).then((res) => {
      this.setState({ restaurantsResults: res.results });
    });

    getMyRecipes(id).then((res) => {
      this.setState({ recipeResults: res.results });
    });

    getMyFavorites(id).then((res) => {
      this.setState({ favoriteResults: res.results });
    });
  }

  getRestaurantsByRecipeCount() {
    const id = sessionStorage.getItem("id");
    getMyRestaurantsRecipes(id).then((res) => {
      this.setState({ restaurantsResults: res.results });
    });
  }

  onSelectRestaurantChange(selectedRowKeys) {
    this.setState({ selectedRestaurants: selectedRowKeys });
  }

  onSelectRecipeChange(selectedRowKeys) {
    this.setState({ selectedRecipes: selectedRowKeys });
  }

  deleteUserRestaurants(restaurant_ids) {
    const user_id = sessionStorage.getItem("id");
    if (restaurant_ids.length > 0) {
      deleteMyRestaurants(user_id, restaurant_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  deleteUserRecipes(recipe_ids) {
    const user_id = sessionStorage.getItem("id");
    if (recipe_ids.length > 0) {
      deleteMyRecipes(user_id, recipe_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  render() {
    const selectedRestaurantKeys = this.state.selectedRestaurants;
    const selectedRecipeKeys = this.state.selectedRecipes;
    return (
      <div>
        <MenuBar />
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>My Restaurants</h3>
          <Button
            type="primary"
            style={{ float: "right" }}
            onClick={() => {
              this.getRestaurantsByRecipeCount();
            }}
          >
            Sort By Number of Recipes
          </Button>
          <Button
            type="primary"
            onClick={() => {
              this.deleteUserRestaurants(this.state.selectedRestaurants);
            }}
          >
            Delete
          </Button>
          <Table
            dataSource={this.state.restaurantsResults}
            columns={restaurantColumns}
            rowKey="restaurant_id"
            pagination={{
              pageSizeOptions: [10, 20],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
            rowSelection={{
              selectedRestaurantKeys,
              onChange: this.onSelectRestaurantChange,
            }}
          />
        </div>
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>My Recipes</h3>
          <Button
            type="primary"
            onClick={() => {
              this.deleteUserRecipes(this.state.selectedRecipes);
            }}
          >
            Delete
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
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>My Favorites</h3>
          <Table
            dataSource={this.state.favoriteResults}
            columns={favoriteColumns}
            pagination={{
              pageSizeOptions: [10, 20],
              defaultPageSize: 10,
              showQuickJumper: true,
            }}
          />
        </div>
      </div>
    );
  }
}

export default MyPage;
