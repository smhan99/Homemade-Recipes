import React from "react";
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "shards-react";

class MenuBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("email");
  }

  render() {
    const logged_in = sessionStorage.getItem("id") !== null;
    return (
      <Navbar type="dark" theme="primary" expand="md">
        <NavbarBrand href="/">Homemade Restaurants</NavbarBrand>
        <Nav navbar>
          {logged_in && (
            <NavItem>
              <NavLink active href="/mypage">
                My Page
              </NavLink>
            </NavItem>
          )}
          <NavItem>
            <NavLink active href="/restaurants">
              Restaurants
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink active href="/recipes">
              Recipes
            </NavLink>
          </NavItem>
        </Nav>
        {!logged_in && (
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink active href="/login">
                Login
              </NavLink>
            </NavItem>
          </Nav>
        )}
        {logged_in && (
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink active href="/" onClick={this.handleLogout}>
                Logout
              </NavLink>
            </NavItem>
          </Nav>
        )}
      </Navbar>
    );
  }
}

export default MenuBar;
