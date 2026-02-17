#!/bin/bash

# Script to issue an AdminCap to yourself
# This allows you to issue certificates
# Usage: ./issue_admin_cap.sh "Your Institution Name" <your-address>

PACKAGE_ID="0x3289b8cbc59ccd657166e0b71565941fa3456d93f4d318b1a0a1ff7cd5928542"
REGISTRY_ID="0xfc79e11d93b0dfc10de06d3350c9c57acf1d90e31ea925aeec81d8be3dd7dbd4"

INSTITUTION_NAME="${1:-My Institution}"
INSTITUTION_ADDRESS="${2}"

if [ -z "$INSTITUTION_ADDRESS" ]; then
    echo "Usage: $0 \"Institution Name\" <your-sui-address>"
    echo "Example: $0 \"SuiCert Academy\" 0x1234..."
    exit 1
fi

echo "Issuing AdminCap to: $INSTITUTION_NAME"
echo "Address: $INSTITUTION_ADDRESS"
echo ""

# All certificate types: [1,2,3,4,5]
# 1 = Course, 2 = Degree, 3 = Skill, 4 = Achievement, 5 = Bootcamp

sui client call \
    --package "$PACKAGE_ID" \
    --module certificate \
    --function issue_admin_cap \
    --args "$REGISTRY_ID" \
    --args "$INSTITUTION_NAME" \
    --args "$INSTITUTION_ADDRESS" \
    --args "[1,2,3,4,5]" \
    --gas-budget 50000000

echo ""
echo "AdminCap issued! Check your wallet for the new AdminCap object."
