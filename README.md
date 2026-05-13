# WanBi Hub Launcher

Một ứng dụng desktop chuyên dụng được xây dựng bằng Electron, React và TypeScript. Ứng dụng cung cấp giao diện hiện đại, quản lý các dịch vụ chạy ngầm, hỗ trợ khởi động cùng hệ thống (open at login) và thông báo (notifications) native trên macOS.

## Hướng dẫn Tải và Cài đặt dành cho người dùng

Khi truy cập vào trang [Releases](https://github.com/anhnbt/hub-launcher/releases) để tải ứng dụng, bạn sẽ thấy rất nhiều file. Hãy tải đúng file cài đặt tùy theo hệ điều hành của bạn:

- **Dành cho macOS (Chip Apple Silicon M1/M2/M3...):** Tải file có đuôi `.dmg` (Ví dụ: `WanBi-Hub-Launcher-1.1.0-arm64.dmg`).
- **Dành cho Windows:** Tải file có đuôi `.exe` (Ví dụ: `WanBi-Hub-Launcher-1.1.0-setup.exe`).

> **Lưu ý:** Xin vui lòng **BỎ QUA** các file có đuôi `.blockmap`, `.yml` hoặc `.zip`. Đây là các file hệ thống do ứng dụng tự động sử dụng ngầm ở background để phục vụ cho tính năng Auto-Update (tự động cập nhật phiên bản mới) cực kỳ nhanh chóng.

## Môi trường phát triển đề xuất

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Cài đặt dự án

### Cài đặt thư viện

```bash
$ npm install
```

### Chạy ở chế độ phát triển (Development)

```bash
$ npm run dev
```

### Build ứng dụng (Production)

```bash
# Cho Windows
$ npm run build:win

# Cho macOS
$ npm run build:mac

# Cho Linux
$ npm run build:linux
```

## Quy trình Phát hành (Release)

Dự án sử dụng GitHub Actions để tự động build và publish release khi có một Tag phiên bản mới được đẩy lên (ví dụ: `v1.1.0`).
Để tạo tag mới và tự động kích hoạt tiến trình Release, hãy chạy các lệnh sau:

```bash
# Nâng cấp phiên bản trong package.json và tạo tag mới (ví dụ: patch, minor, major, hoặc version cụ thể)
$ npm version minor -m "chore: release v%s"

# Push nhánh main kèm theo tag lên GitHub
$ git push origin main --tags
```
Sau khi push, GitHub Actions sẽ tiến hành build tự động và publish release trực tiếp mà không cần qua trạng thái Draft.
