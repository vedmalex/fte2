<#@ noContent #>
#!upstart
description "run app server for Modeleditor"
author      "grain.js-framework"

#start on startup
#stop on shutdown
start on (net-device-up
          and local-filesystems
          and runlevel [2345])
stop on runlevel [016]

script
    cd "#{context.grainUserRoot}"
    sudo grainjs run "Modeleditor" 2>&1 >> server.log
end script
