import React from "react";
import { Table, Button, Row, Col } from "antd";
import { Form, FormInput, FormGroup } from "shards-react";

import MenuBar from "../components/MenuBar";
import {
  addMyRestaurants,
  getRestaurantSearch,
  getNearByRestaurants,
  getAllRestaurants,
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

const nearbyRestaurantColumns = [
  {
    title: "Restaurant Name",
    dataIndex: "restaurant_name",
    key: "restaurant_name",
    render: (text, row) => (
      <a href={`/restaurant?id=${row.restaurant_id}`}>{text}</a>
    ),
  },
];

class RestaurantsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nameQuery: "",
      locationQuery: "",
      cuisineQuery: "",
      phoneQuery: "",
      restaurantsResults: [],
      nearbyRestaurantsResults: [],
      selectedRestaurants: [],
    };
    this.addUserRestaurants = this.addUserRestaurants.bind(this);
    this.onSelectRestaurantChange = this.onSelectRestaurantChange.bind(this);
    this.handleNameQueryChange = this.handleNameQueryChange.bind(this);
    this.handleLocationQueryChange = this.handleLocationQueryChange.bind(this);
    this.handleCuisineQueryChange = this.handleCuisineQueryChange.bind(this);
    this.handlePhoneQueryChange = this.handlePhoneQueryChange.bind(this);
    this.updateSearchResults = this.updateSearchResults.bind(this);
  }

  handleNameQueryChange(event) {
    this.setState({ nameQuery: event.target.value });
  }

  handleLocationQueryChange(event) {
    this.setState({ locationQuery: event.target.value });
  }

  handleCuisineQueryChange(event) {
    this.setState({ cuisineQuery: event.target.value });
  }

  handlePhoneQueryChange(event) {
    this.setState({ phoneQuery: event.target.value });
  }

  updateSearchResults() {
    getRestaurantSearch(
      this.state.nameQuery,
      this.state.locationQuery,
      this.state.cuisineQuery,
      this.state.phoneQuery
    ).then((res) => {
      this.setState({ restaurantsResults: res.results });
    });
  }

  onSelectRestaurantChange(selectedRowKeys) {
    this.setState({ selectedRestaurants: selectedRowKeys });
  }

  onSelectNearbyRestaurantChange(selectedRowKeys) {
    this.setState({ selectedNearbyRestaurants: selectedRowKeys });
  }

  addUserRestaurants(restaurant_ids) {
    const user_id = sessionStorage.getItem("id");
    if (restaurant_ids.length > 0) {
      addMyRestaurants(user_id, restaurant_ids).then((res) => {
        window.location.reload();
      });
    }
  }

  componentDidMount() {
    const user_id = sessionStorage.getItem("id");
    if (user_id) {
      getNearByRestaurants(user_id).then((res) => {
        this.setState({ nearbyRestaurantsResults: res.results });
      });
    }
    getAllRestaurants("").then((res) => {
      this.setState({ restaurantsResults: res.results });
    });
  }

  render() {
    const logged_in = sessionStorage.getItem("id") !== null;
    const selectedRestaurantKeys = this.state.selectedRestaurants;
    return (
      <div>
        <MenuBar />
        <Form style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <Row>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Name</label>
                <FormInput
                  placeholder="Name"
                  value={this.state.nameQuery}
                  onChange={this.handleNameQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Location</label>
                <FormInput
                  placeholder="Location"
                  value={this.state.locationQuery}
                  onChange={this.handleLocationQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Cuisine</label>
                <FormInput
                  placeholder="Cuisine"
                  value={this.state.cuisineQuery}
                  onChange={this.handleCuisineQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "20vw", margin: "0 auto" }}>
                <label>Phone Number Area Code</label>
                <FormInput
                  placeholder="Phone"
                  value={this.state.phoneQuery}
                  onChange={this.handlePhoneQueryChange}
                />
              </FormGroup>
            </Col>
            <Col flex={2}>
              <FormGroup style={{ width: "10vw" }}>
                <Button
                  style={{ marginLeft: "1vh", marginTop: "5vh" }}
                  onClick={this.updateSearchResults}
                >
                  Search
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
        <div style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <h3>Restaurants</h3>
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
        {logged_in && (
          <div style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
            <h3>Nearby Dinner Restaurants</h3>

            <div style={{ marginTop: "2vh" }}>
              <Table
                dataSource={this.state.nearbyRestaurantsResults}
                columns={nearbyRestaurantColumns}
                rowKey="restaurant_id"
                pagination={{
                  pageSizeOptions: [10, 20],
                  defaultPageSize: 10,
                  showQuickJumper: true,
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default RestaurantsPage;
