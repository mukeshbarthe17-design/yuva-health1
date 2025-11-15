# Copy ICD JSON from icd_lookup to public so the front-end can fetch it.
# Usage: run this from the project root (where package.json lives):
#   powershell -ExecutionPolicy Bypass -File .\scripts\copy_icd_to_public.ps1

$source = Join-Path -Path $PSScriptRoot -ChildPath "..\icd_lookup\icd10_data\icd10cm-tabular-2026.json"
$source = (Resolve-Path -Path $source).ProviderPath
$destFolder = Join-Path -Path $PSScriptRoot -ChildPath "..\public"
if (-not (Test-Path $destFolder)) {
    New-Item -ItemType Directory -Path $destFolder | Out-Null
}
$dest = Join-Path -Path $destFolder -ChildPath "icd10cm-tabular-2026.json"

Write-Host "Copying $source to $dest ..."
Copy-Item -Path $source -Destination $dest -Force
Write-Host "Done. The front-end can now fetch /icd10cm-tabular-2026.json"
