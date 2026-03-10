#!/bin/bash

# Run All Tests Script
# This script will setup test users and run all Playwright E2E tests

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Profile Management - Playwright E2E Test Suite        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Setup test users
echo -e "${CYAN}[1/2] Setting up test users...${NC}"
node scripts/setup-test-users.js
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to setup test users${NC}"
    exit 1
fi

echo ""

# Run Playwright tests
echo -e "${CYAN}[2/2] Running Playwright E2E tests...${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Playwright will start dev server automatically
npx playwright test

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
    echo -e "  ${GREEN}✅ KARYAWAN - Profile access, create, update, security${NC}"
    echo -e "  ${GREEN}✅ ADMIN - Profile with admin fields${NC}"
    echo -e "  ${GREEN}✅ Access Control - Role-based menu visibility${NC}"
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
    echo -e "  ${YELLOW}3. Run with UI mode: npm run test:ui${NC}"
    echo -e "  ${YELLOW}4. Check screenshots in test-results/ folder${NC}"
fi

echo ""
exit $EXIT_CODE
