<#@ context "model" -#>
<#@ chunks "$$$main$$$" -#>
<#@ alias "ui-next-js-root"#>

<#- chunkStart(`../../pages/${model.name}.js`); #>
import dynamic from 'next/dynamic';

const Admin = dynamic(() => import('../components/#{model.name}'), { ssr: false });

export default () => <Admin />;