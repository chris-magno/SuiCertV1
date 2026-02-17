# Script to issue an AdminCap to yourself
# This allows you to issue certificates
# Usage: .\issue_admin_cap.ps1 -InstitutionName "Your Institution"

param(
    [Parameter(Mandatory=$false)]
    [string]$InstitutionName = "My Institution"
)

$PACKAGE_ID = "0x3289b8cbc59ccd657166e0b71565941fa3456d93f4d318b1a0a1ff7cd5928542"
$REGISTRY_ID = "0xfc79e11d93b0dfc10de06d3350c9c57acf1d90e31ea925aeec81d8be3dd7dbd4"

# Get the active address
$Address = (sui client active-address 2>$null | Select-Object -Last 1).Trim()

Write-Host "Issuing AdminCap to: $InstitutionName" -ForegroundColor Cyan
Write-Host "Your Address: $Address" -ForegroundColor Cyan
Write-Host ""
Write-Host "Creating Programmable Transaction Block..." -ForegroundColor Yellow
Write-Host ""

# Create a PTB that calls the function and transfers the result
$moveCall = "${PACKAGE_ID}::certificate::issue_admin_cap"
$args = @(
    $REGISTRY_ID,
    "`"$InstitutionName`"",
    $Address,
    "[1,2,3,4,5]"
)
$argsString = $args -join " "

# Execute PTB: call function, then transfer the result
sui client ptb `
    --move-call $moveCall $argsString `
    --assign result `
    --transfer-objects result $Address `
    --gas-budget 50000000

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ AdminCap successfully issued!" -ForegroundColor Green
    Write-Host "Check your wallet for the new AdminCap object." -ForegroundColor Green
    Write-Host "Refresh the frontend to start issuing certificates." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "✗ Failed to issue AdminCap" -ForegroundColor Red
    Write-Host "See error above for details" -ForegroundColor Red
}
