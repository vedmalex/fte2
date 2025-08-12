<#@ noContent #>
DEBUG_STAGE_TIMEOUT=10000
DEBUG_APP=false
NO_CLIENT_CACHE=#{context.noClientCache}
NO_HEALTH_CHECK=#{context.noHealthCheck}
NO_SERVER_CACHE=#{context.noServerCache}
NO_TRANSLATION_TOOLS=#{context.noTranslationTools}
PORT=#{context.httpPort||3000}
THEME=#{context.theme||''}
DIRECT_TIMEOUT=#{context.directEntryTimeout || 100000}
DIRECT_API_BUFFER=#{context.directApiBufferTime || 0}
TRANSLATION=false
APP_NAME=#{context.name}
RTL=#{context.rtl}
LOCALE=#{context.language}
SYSTEM_URL=#{context.dbUrl}
LOCAL_URL=#{context.dbUrl}
#COOKIE_SECRET='your secret here'
<#  if(!context.filesDb || context.filesDb === context.dbUrl){ #>#<# } #>FILES_URL=#{context.filesDb??""}
<#  if(!context.usersDb || context.usersDb === context.dbUrl){ #>#<# } #>USERS_URL=#{context.usersDb??""}
<#  if(!context.auditDb || context.auditDb === context.dbUrl){ #>#<# } #>AUDIT_URL=#{context.auditDb??""}
<#  if(!context.transactionsDb || context.transactionsDb === context.dbUrl){ #>#<# } #>TRANSACTIONS_URL=#{context.transactionsDb??""}
<#  if(!context.sessionDb || context.sessionDb === context.dbUrl){ #>#<# } #>SESSION_URL=#{context.sessionDb??""}
<# if (context.env) {
  const env = JSON.parse(context.env)
  const envList = Object.keys(env)
  for (let i = 0; i < envList.length; i++){
    const key = envList[i] -#>
#{key}=#{env[key]}
<# }} #>
