import React, { useState } from "react";
import CurrencyFormat from 'react-currency-format';
import {Form} from 'antd';

const InputCurrency = (props) => {
  const [value, setValue] = useState(props.value || '');
  const input = (
  <Form.Item
      label={props.label}
      labelAlign="left"
      name={props.name}
      hasFeedback
      rules={props.rules}
      className={props.className}
      initialValue={props.initialValue ? props.initialValue : ""}
  >
    <CurrencyFormat placeholder={props.placeholder}  name={props.name} value={value} thousandSeparator={true} onValueChange={(values) => {
        const {formattedValue} = values;
        setValue(formattedValue)
    }} className="ant-input"/>
  </Form.Item>

  );
  return input;
}

export default InputCurrency