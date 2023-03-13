import React from "react";
import { Table } from "antd";

import MenuBar from "../components/MenuBar";
import { getRestaurant } from "../fetcher";
const menuitemColumns = [
  {
    title: "Name",
    dataIndex: "menuitem_name",
    key: "menuitem_name",
    sorter: (a, b) => a.menuitem_name.localeCompare(b.menuitem_name),
    render: (text, row) => (
      <a href={`/menuitem?id=${row.menuitem_id}`}>{text}</a>
    ),
  },
  {
    title: "Category",
    dataIndex: "menuitem_category",
    key: "menuitem_category",
    sorter: (a, b) => a.menuitem_category.localeCompare(b.menuitem_category),
  },
];

class RestaurantPage extends React.Component {
  constructor(props) {
    super(props);
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    this.state = {
      restaruantId: params ? params.id : 0,
      menuitems: [],
      restaurantName: "",
      restaurantLocation: "",
      restaurantPhone: "",
      categories: "",
    };
  }

  componentDidMount() {
    getRestaurant(this.state.restaruantId).then((res) => {
      this.setState({ menuitems: res.results[0].menuitems });
      this.setState({ restaurantName: res.results[0].restaurant_name });
      this.setState({ restaurantLocation: res.results[0].restaurant_location });
      this.setState({ restaurantPhone: res.results[0].restaurant_phone });
      this.setState({ categories: res.results[0].categories });
    });
  }

  render() {
    return (
      <div style={{ marginBottom: "15vh" }}>
        <MenuBar />
        <div style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2 style={{ marginTop: "5vh" }}>{this.state.restaurantName}</h2>
          <h4 style={{ marginTop: "5vh" }}>
            Address: {this.state.restaurantLocation}
          </h4>
          <h4 style={{ marginTop: "5vh" }}>
            Phone Number: {this.state.restaurantPhone}
          </h4>
          <h4 style={{ marginTop: "5vh" }}>
            Categories: {this.state.categories}
          </h4>
          <h4 style={{ marginTop: "10vh" }}>Menu Items</h4>

          <Table
            dataSource={this.state.menuitems}
            columns={menuitemColumns}
            rowKey="menuitem_id"
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

export default RestaurantPage;
