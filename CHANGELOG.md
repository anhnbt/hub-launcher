# Nhật ký thay đổi (Changelog)

Tất cả các thay đổi đáng chú ý của dự án WanBi Hub Launcher sẽ được ghi lại trong file này.

Dự án tuân theo [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Thêm mới (Added)
- Đổi tên ứng dụng thành **WanBi Hub Launcher** trên toàn bộ hệ thống (kể cả cấu hình electron-builder).
- Thêm logo/icon mới mang thương hiệu riêng cho ứng dụng.
- **Tính năng Khởi động cùng hệ thống (Startup on Login):** Người dùng có thể thiết lập cho ứng dụng tự khởi động cùng Windows/macOS thông qua Settings.
- **Tính năng Thông báo (Notifications):**
  - Tự động yêu cầu quyền hiển thị thông báo khi mở ứng dụng trên macOS.
  - Thêm nút "Gửi thử thông báo" trong màn hình Settings kèm theo cảnh báo lỗi chi tiết khi quyền bị từ chối.
  - Ngôn ngữ thông báo được Việt hóa hoàn toàn.
- Bổ sung tài liệu hướng dẫn (`README.md` bằng tiếng Việt) và file quy định nội bộ (`GEMINI.md`).

### Thay đổi & Cải thiện (Changed & Improved)
- Cấu hình chỉ hiển thị công cụ phát triển (DevTools) trong môi trường phát triển (Development). Trong môi trường Production, DevTools mặc định bị ẩn để đảm bảo trải nghiệm người dùng cuối.
- Giao diện (UI/UX) của `SettingsPanel` được cập nhật:
  - Thêm nút bật/tắt (toggle) Khởi động cùng hệ thống.
  - Thêm nút cấu hình và kiểm tra thông báo.
