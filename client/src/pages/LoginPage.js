import React from "react";
import MenuBar from "../components/MenuBar";
import { Form, Input, Button } from "antd";
import { getLoginInfo } from "../fetcher";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(value) {
    getLoginInfo(value.email, value.password).then((res) => {
      if (res.results.length > 0) {
        const id = res.results[0].id;
        const email = res.results[0].email;
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("email", email);
        window.location = `/mypage?id=${id}`;
      } else {
        this.setState({ failed: true });
      }
    });
  }

  render() {
    return (
      <div>
        <MenuBar />
        <div style={{ width: "50vw", margin: "0 auto", marginTop: "10vh" }}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={this.handleLogin}
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
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Log in
              </Button>
            </Form.Item>

            {this.state.failed && (
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                Your login credentials could not be verified, please try again.
              </Form.Item>
            )}

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              Or <a href="/register">Register Now!</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginPage;
