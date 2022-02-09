#Requires -Version 7

try
{
    $cors = Start-Job -ScriptBlock { node .\cors-server\index.js }
    $nestApp = Start-Job -ScriptBlock { pnpm start -C .\api }
    $reactApp = Start-Job -ScriptBlock { pnpm dev -C .\web}
    write-host "Running..."
    Wait-Event
}
catch
{
    write-host "Problem occured!"
}
finally
{
    $cors.StopJob()
    $nestApp.StopJob()
    $reactApp.StopJob()
}
