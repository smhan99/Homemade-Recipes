import React from "react";
import { Table } from "antd";

import MenuBar from "../components/MenuBar";
import { getMenuItem } from "../fetcher";
const recipeColumns = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    sorter: (a, b) => a.recipe_title.localeCompare(b.recipe_title),
    render: (text, row) => <a href={`/recipe?id=${row.id}`}>{text}</a>,
  },
  {
    title: "Url",
    dataIndex: "url",
    key: "url",
    render: (text, row) => <a href={`${text}`}>{text}</a>,
  },
];

class MenuItemPage extends React.Component {
  constructor(props) {
    super(props);
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    this.state = {
      menuitemId: params ? params.id : 0,
      menuitemName: "",
      recipes: [],
    };
  }

  componentDidMount() {
    getMenuItem(this.state.menuitemId).then((res) => {
      this.setState({ menuitemName: res.results[0].menuitem_name });
      this.setState({ recipes: res.results[0].recipes });
    });
  }

  render() {
    return (
      <div style={{ marginBottom: "15vh" }}>
        <MenuBar />
        <div style={{ width: "90vw", margin: "0 auto", marginTop: "5vh" }}>
          <h2 style={{ marginTop: "5vh" }}>{this.state.menuitemName}</h2>
          <h4 style={{ marginTop: "10vh" }}>Matched Recipes</h4>
          <Table
            dataSource={this.state.recipes}
            columns={recipeColumns}
            rowKey="recipe_id"
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

export default MenuItemPage;
