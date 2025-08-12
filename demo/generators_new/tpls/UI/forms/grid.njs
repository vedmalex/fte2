<#@ context "entity" -#>
<#@ alias 'forms-grid' -#>

import React, { useContext } from "react";
import { UIXContext } from '../contexts';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Grid = ({fields, ...props}) =>  {
  const { filterValues } = props;
  const filteredFields = filterValues
    ? Object.keys(filterValues).reduce((list, fld) => {
        if (fld.match(/-eq/)) {
          list.push(`!${fld.split('-')[0]}`);
        }
        return list;
      }, [])
    : undefined;
  const uix = useContext(UIXContext);
  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
  // const Result = isXSmall
  //   ? uix.#{entity.name}.ListView 
  //   : isSmall 
  //   ? uix.#{entity.name}.CardView 
  //   : uix.#{entity.name}.GridView

  const Result = uix.#{entity.name}.GridView

  return (
    <Result
      {...props}
      fields={fields ? fields.concat(filteredFields) : filteredFields}
    />
  );
}

export default Grid;