<#@ context "_enum" -#>
<#@ alias "ui-enums" -#>
<#@ chunks "$$$main$$$" -#>

<#- chunkStart(`${_enum.name}/index.js`); -#>
import React, { useContext } from 'react';
import { UIXContext } from '../contexts';

export const translation = {
  enums: {
    #{_enum.name}: {
<# _enum.items.forEach(item=>{-#>
      #{item.name}: '#{item.metadata?.UI?.title || item.name}',
<#})#>
    },
  },
};

const choices = [
<# _enum.items.forEach(item=>{-#>
  { id: '#{item.name}', name: 'enums.#{_enum.name}.#{item.name}' },
<#})#>
];
const Input = (props) => {
  const uix = useContext(UIXContext);
  return (
    <uix.SelectInput
      {...props}
      choices={choices}
    />
  );
}



const Field = (props) => {
  const uix = useContext(UIXContext);
  return (<uix.SelectField {...props} choices={choices}/>)
  }

export default {
  Input,
  Field,
  choices,
};
