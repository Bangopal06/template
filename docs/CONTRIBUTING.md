# Contributing to Next.js Dashboard Template

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## How to Contribute

### Reporting Bugs

Jika Anda menemukan bug:

1. Cek apakah bug sudah dilaporkan di Issues
2. Jika belum, buat Issue baru dengan:
   - Deskripsi jelas tentang bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment (OS, Node version, dll)
   - Screenshots jika perlu

### Suggesting Features

Untuk request fitur baru:

1. Buat Issue dengan label "enhancement"
2. Jelaskan use case dan benefit dari fitur tersebut
3. Berikan contoh implementasi jika memungkinkan

### Pull Requests

1. Fork repository
2. Create branch baru: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Submit Pull Request

#### PR Guidelines

- Pastikan code berjalan tanpa error
- Update dokumentasi jika perlu
- Ikuti code style yang ada
- Test perubahan Anda

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/nextjs-dashboard-template.git

# Install dependencies
npm install

# Setup .env
cp .env.example .env
# Edit .env dengan credentials Anda

# Setup database
bunx prisma generate
bunx prisma db push

# Run dev server
npm run dev
```

## Code Style

- Use TypeScript
- Follow existing code patterns
- Use meaningful variable names
- Add comments untuk logic yang kompleks
- Format code dengan Prettier (jika ada)

## Testing

Sebelum submit PR, pastikan:

- [ ] App bisa build: `npm run build`
- [ ] No TypeScript errors
- [ ] Login/Register working
- [ ] Dashboard accessible
- [ ] Logout working

## Questions?

Jika ada pertanyaan, silakan:
- Buat Issue dengan label "question"
- Atau hubungi maintainer

## License

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah MIT License.
