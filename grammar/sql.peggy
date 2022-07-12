query = select _ selection:select_stmt _ from _ from:from_stmt _{return {type:'select', selection, from}}

select = 'SELECT'i
from = 'FROM'i
// select_stmt = $[a-z0-9_]i*
select_stmt = ident:identifier
	rest:(',' _ @identifier)* {return [ident, ...rest]}
from_stmt = $[a-z0-9_]i*
text = !(select/from/whitespace).


identifier = $([a-z][a-z0-9]*)

_ = sp:whitespace? {return {type:'space', count:sp?.length}}
whitespace = [' '\n\t]