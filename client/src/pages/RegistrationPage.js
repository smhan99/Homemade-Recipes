import React from "react";
import MenuBar from "../components/MenuBar";
import { doRegistration } from "../fetcher";
import { Form, Input, Button } from "antd";

class RegistrationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  handleRegistration(value) {
    doRegistration(
      value.email,
      value.name,
      value.state,
      value.zipcode,
      value.password
    ).then((res) => {
      if (res.error) {
        this.setState({ failed: true });
      } else {
        window.location = `/login`;
      }
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: "50vw", margin: "0 auto", marginTop: "10vh" }}>
          <Form
            name="register"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={this.handleRegistration}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item label="Name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
            <Form.Item label="Zipcode" name="zipcode">
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Register
              </Button>
            </Form.Item>
            {this.state.failed && (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                An account with your email already exists, please try again.
              </Form.Item>
            )}
          </Form>
        </div>
      </div>
    );
  }
}

export default RegistrationPage;
