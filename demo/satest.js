//test standalone

const { readFileSync } = require('fs')
const factory = require('../standalone')
const fte = new Factory(templates)

fte.run(`<# block "filename1.txt" : #>
file1
<# end #>

<# block "filename2.txt" : #>
file2
<# end #>

<# block "filename3.txt" : #>
file3
<# end #>

<# block "filename4.txt" : #>
file4
<# end #>

<# block "filename5.txt" : #>
file5
<# end #>
`)
