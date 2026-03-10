#!/bin/bash

# Run Prodi Management Tests Script

# Get script directory and project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Prodi Management - Playwright E2E Test Suite          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Change to project root
cd "$PROJECT_ROOT"

# Setup test users
echo -e "${CYAN}[1/2] Setting up test users...${NC}"
node scripts/setup-test-users.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to setup test users${NC}"
    exit 1
fi

echo ""

# Run Playwright tests for prodi
echo -e "${CYAN}[2/2] Running Prodi E2E tests...${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Playwright will start dev server automatically
npx playwright test tests/prodi.spec.ts

# Capture exit code
EXIT_CODE=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              🎉 ALL TESTS PASSED! 🎉                       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}📊 Test Coverage:${NC}"
    echo -e "  ${GREEN}✅ ADMIN - Create, read, update, delete prodi${NC}"
    echo -e "  ${GREEN}✅ Access Control - Role-based access${NC}"
    echo -e "  ${GREEN}✅ Data Integrity - Timestamps, soft delete${NC}"
    echo -e "  ${GREEN}✅ Validation - Form validation, duplicate check${NC}"
    echo ""
    echo -e "${CYAN}📝 View detailed report: npm run test:report${NC}"
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║              ⚠️  SOME TESTS FAILED ⚠️                      ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}🔍 Troubleshooting:${NC}"
    echo -e "  ${YELLOW}1. Check test output above for errors${NC}"
    echo -e "  ${YELLOW}2. View HTML report: npm run test:report${NC}"
    echo -e "  ${YELLOW}3. Run with UI mode: npm run test:ui tests/prodi.spec.ts${NC}"
    echo -e "  ${YELLOW}4. Check screenshots in test-results/ folder${NC}"
fi

echo ""
exit $EXIT_CODE
