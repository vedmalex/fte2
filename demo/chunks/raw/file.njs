<#@ chunks 'main.file.txt' #>
<#@ includeMainChunk #>

<# chunkStart("filename1.txt") #>
file1

<# chunkStart("filename2.txt")#>
file2

<# chunkStart("filename3.txt") #>
file3

<# chunkEnd() #>
!!!
<# chunkStart("filename4.txt") #>
file4

<# chunkStart("filename5.txt") #>
file5

<# chunkStart("filename6.txt") #>
file6
