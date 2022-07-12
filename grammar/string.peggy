tempalte = noSubstTemplate / templateHead inner (templateMid inner)* templateEnd

templateHead = '`' exp:$chars? '${' {return {head:exp}}
templateMid = '}' exp:$chars? '${' {return {mid:exp}}
templateEnd = '}' exp:$chars? '`' {return {end:exp}}

spec = '`'/'${'
char = !spec .
inner = $(![}`].)*
chars = str:$char tail:$chars* {return {text: str+tail}}
noSubstTemplate = '`' str:$(chars)? '`' {return {text:str}}



