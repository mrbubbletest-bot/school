$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:5500/')
$listener.Start()
Write-Host 'Server started on http://localhost:5500'

while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response

    $urlPath = $req.Url.AbsolutePath
    if ($urlPath -eq '/') { $urlPath = '/index.html' }

    $filePath = 'c:\AG\School' + $urlPath.Replace('/', '\')

    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        $ctMap = @{
            '.html' = 'text/html; charset=utf-8'
            '.css'  = 'text/css; charset=utf-8'
            '.js'   = 'text/javascript; charset=utf-8'
            '.json' = 'application/json; charset=utf-8'
            '.md'   = 'text/plain; charset=utf-8'
            '.png'  = 'image/png'
            '.jpg'  = 'image/jpeg'
            '.svg'  = 'image/svg+xml'
        }
        $ct = $ctMap[$ext]
        if (-not $ct) { $ct = 'text/plain; charset=utf-8' }
        $res.ContentType = $ct
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
        $notFound = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
        $res.OutputStream.Write($notFound, 0, $notFound.Length)
    }

    $res.Close()
}
