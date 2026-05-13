# Quy định làm việc cho Assistant (Gemini / Antigravity)

File này chứa các quy tắc quan trọng để định hướng việc phát triển cho dự án **WanBi Hub Launcher**. Khi làm việc với dự án này, trợ lý AI vui lòng đọc và tuân thủ các quy định dưới đây.

## 1. Công nghệ & Kiến trúc
- **Framework:** Electron, React, TypeScript, Vite.
- **Package Manager:** `npm`.
- **Giao tiếp:** Luôn định nghĩa các channel qua IPC thay vì hardcode chuỗi string (vd: dùng object `IPC_CHANNELS` trong `src/shared/types.ts`).

## 2. Tiêu chuẩn Mã nguồn
- **Ngôn ngữ lập trình:** Viết code bằng TypeScript, tuân thủ chặt chẽ việc định nghĩa Types/Interfaces cho các hàm và IPC handlers.
- **Giao diện (UI/UX):**
  - Tuân thủ UI hiện tại, dùng các utility class có sẵn (nếu có dùng TailwindCSS hoặc CSS tự viết).
  - Ưu tiên hiển thị thông báo, feedback thân thiện với người dùng (tiếng Việt).
- **Môi trường (Environment):**
  - DevTools chỉ được phép mở ở môi trường Development (`is.dev`). TUYỆT ĐỐI không hiển thị DevTools trong Production.

## 3. Hệ thống & Quyền hệ thống (System & Permissions)
- **Startup on Login (Khởi động cùng hệ thống):**
  - Luôn sử dụng `app.setLoginItemSettings()` của Electron. Không dùng thư viện ngoài nếu không cần thiết.
- **Notifications (Thông báo):**
  - Trên macOS, ứng dụng phải request quyền hiển thị thông báo đúng cách.
  - Phải xử lý ngoại lệ (try/catch) cho trường hợp quyền bị từ chối hoặc macOS chặn thông báo.
  
## 4. Ngôn ngữ & Tài liệu
- **Tài liệu (README, CHANGELOG, etc.):** Ưu tiên viết bằng tiếng Việt trừ khi có yêu cầu đặc biệt.
- **Giao diện ứng dụng:** Các text hiển thị trên UI, dialog, notification đều phải dùng Tiếng Việt.

## 5. Quy trình Git & Commit
- Message của commit phải rõ ràng, ngắn gọn, nên theo chuẩn Conventional Commits (vd: `feat: ...`, `fix: ...`, `docs: ...`).
- Không push thẳng lên `main`. Tạo nhánh `feat/*` hoặc `fix/*`, sau đó mở Pull Request.
