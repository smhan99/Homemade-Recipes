import React from "react";
import { Table, Select, Button } from "antd";

import MenuBar from "../components/MenuBar";
import {
  getAllRestaurants,
  getManyRecipes,
  addMyRestaurants,
  addMyRecipes,
  getPopularCategories,
} from "../fetcher";
const { Option } = Select;

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

const categoryColumns = [
  {
    title: "Restaurant Category",
    dataIndex: "category_name",
    key: "category_name",
  },
  {
    title: "Number of Menu items",
    dataIndex: "count",
    key: "count",
    sorter: (a, b) => a.count.localeCompare(b.count),
  },
];

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      restaurantsResults: [],
      recipeResults: [],
      categoryResults: [],
      selectedRestaurants: [],
      selectedRecipes: [],
    };

    this.cityOnChange = this.cityOnChange.bind(this);
    this.addUserRestaurants = this.addUserRestaurants.bind(this);
    this.addUserRecipes = this.addUserRecipes.bind(this);
    this.onSelectRestaurantChange = this.onSelectRestaurantChange.bind(this);
    this.onSelectRecipeChange = this.onSelectRecipeChange.bind(this);
  }

  cityOnChange(value) {
    getAllRestaurants(value).then((res) => {
      this.setState({ restaurantsResults: res.results });
    });
  }

  onSelectRestaurantChange(selectedRowKeys) {
    this.setState({ selectedRestaurants: selectedRowKeys });
  }

  onSelectRecipeChange(selectedRowKeys) {
    this.setState({ selectedRecipes: selectedRowKeys });
  }

  addUserRestaurants(restaurant_ids) {
    const user_id = sessionStorage.getItem("id");
    if (restaurant_ids.length > 0) {
      addMyRestaurants(user_id, restaurant_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  addUserRecipes(recipe_ids) {
    const user_id = sessionStorage.getItem("id");
    if (recipe_ids.length > 0) {
      addMyRecipes(user_id, recipe_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  componentDidMount() {
    getAllRestaurants("Philadelphia").then((res) => {
      this.setState({ restaurantsResults: res.results });
    });

    getManyRecipes().then((res) => {
      this.setState({ recipeResults: res.results });
    });

    getPopularCategories().then((res) => {
      this.setState({ categoryResults: res.results });
    });
  }

  render() {
    const logged_in = sessionStorage.getItem("id") !== null;
    const selectedRestaurantKeys = this.state.selectedRestaurants;
    const selectedRecipeKeys = this.state.selectedRecipes;

    return (
      <div>
        <MenuBar />
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Restaurants</h3>
          <Select
            defaultValue="Philadelphia"
            style={{ width: 120 }}
            onChange={this.cityOnChange}
          >
            <Option value="Philadelphia">Philadelphia</Option>
            <Option value="New York">New York City</Option>
          </Select>
          {logged_in && (
            <div style={{ marginTop: "2vh" }}>
              <Button
                type="primary"
                onClick={() => {
                  this.addUserRestaurants(this.state.selectedRestaurants);
                }}
              >
                Add
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
          )}
          {!logged_in && (
            <Table
              dataSource={this.state.restaurantsResults}
              columns={restaurantColumns}
              rowKey="restaurant_id"
              pagination={{
                pageSizeOptions: [10, 20],
                defaultPageSize: 10,
                showQuickJumper: true,
              }}
            />
          )}
        </div>
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Some Recipes</h3>
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
        <div style={{ width: "70vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Popular Restaurant Categories</h3>
          <Table
            dataSource={this.state.categoryResults}
            columns={categoryColumns}
            rowKey="category_name"
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

export default HomePage;
