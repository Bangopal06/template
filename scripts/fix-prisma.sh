#!/bin/bash

# Fix Prisma Client Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║              Fix Prisma Client Issues                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⚠️  IMPORTANT: Make sure dev server is STOPPED (Ctrl+C)${NC}"
echo ""
sleep 3

echo -e "${CYAN}[1/5] Cleaning Prisma cache...${NC}"
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma
echo -e "${GREEN}✅ Cache cleaned${NC}"

echo ""

echo -e "${CYAN}[2/5] Reinstalling Prisma Client...${NC}"
bun install @prisma/client
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client installed${NC}"

echo ""

echo -e "${CYAN}[3/5] Regenerating Prisma Client...${NC}"
bunx prisma generate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Prisma Client generated${NC}"

echo ""

echo -e "${CYAN}[4/5] Validating schema...${NC}"
bunx prisma validate
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Schema validation failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Schema valid${NC}"

echo ""

echo -e "${CYAN}[5/5] Verifying Prodi model...${NC}"
if grep -q "model Prodi" node_modules/.prisma/client/schema.prisma; then
    echo -e "${GREEN}✅ Prodi model found in Prisma Client${NC}"
else
    echo -e "${RED}❌ Prodi model NOT found in Prisma Client${NC}"
    echo -e "${YELLOW}⚠️  This is a problem! Check prisma/schema.prisma${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              ✅ Prisma Client Fixed!                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📝 CRITICAL Next Steps:${NC}"
echo "  1. Restart TypeScript Server in VS Code:"
echo "     - Press Ctrl+Shift+P (Cmd+Shift+P on Mac)"
echo "     - Type: \"TypeScript: Restart TS Server\""
echo "     - Press Enter"
echo ""
echo "  2. Start dev server:"
echo "     bun run dev"
echo ""
echo "  3. Wait for server to start completely"
echo ""
echo "  4. Access: http://localhost:3000/dashboard/prodi"
echo ""
echo -e "${YELLOW}⚠️  If still not working, see FIX_PRODI_ERROR.md${NC}"
echo ""
