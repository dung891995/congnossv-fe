import { Result, Button } from "antd";
import React from "react";
import { useHistory } from "react-router-dom";
import 'antd/dist/antd.css';

export default (props) => {
  const history = useHistory();
  function handleClick() {
    history.push("/login");
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  );
};
