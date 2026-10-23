param(
    [string]$MongodPath = 'D:\fmiralles\Desktop\mongoDB\bin\mongod.exe',
    [string]$DbPath = 'D:\fmiralles\Desktop\mongoDB\data\db'
)

$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $MongodPath -PathType Leaf)) { throw "No existe mongod: $MongodPath" }
if (-not (Test-Path -LiteralPath $DbPath -PathType Container)) { throw "No existe el directorio de datos: $DbPath" }
if (Get-Process -Name mongod -ErrorAction SilentlyContinue) {
    throw 'MongoDB ya está en ejecución. No se iniciará otra instancia sobre los mismos datos.'
}

$mongoLogDirectory = Join-Path $PSScriptRoot '..\.temp'
New-Item -ItemType Directory -Path $mongoLogDirectory -Force | Out-Null
$mongoLogPath = Join-Path (Resolve-Path -LiteralPath $mongoLogDirectory).Path 'mongodb-local.log'
$mongoProcess = Start-Process -FilePath $MongodPath -ArgumentList @(
    '--dbpath', ('"' + $DbPath + '"'),
    '--replSet', 'rs0',
    '--bind_ip', 'localhost',
    '--port', '27017',
    '--logpath', ('"' + $mongoLogPath + '"'),
    '--logappend'
) -WindowStyle Hidden -PassThru
if ($mongoProcess.WaitForExit(1000)) { throw "MongoDB no inició. Revisar $mongoLogPath" }
Write-Output "MongoDB iniciado como rs0. PID: $($mongoProcess.Id). Log: $mongoLogPath"
