# Week 3–4: BookStore Online

Ứng dụng Expo React Native TypeScript thực hành layout Flexbox. Dữ liệu mẫu trong `data.js`, không cần API hoặc thư viện navigation.

## Chạy trên VS Code (CMD)
1. Giải nén ZIP và mở thư mục `Week3_4_BookStore` trong VS Code.
2. Mở Terminal → Command Prompt (CMD).
3. Chạy `npm install` (cần Internet lần đầu).
4. Chạy `npx expo start`.
5. Nhấn `a` để mở Android emulator hoặc quét QR bằng Expo Go; nhấn `w` để chạy web nếu đã cài thêm dependencies web tương ứng.

Nếu PowerShell báo `npx.ps1 cannot be loaded`, chuyển sang CMD hoặc chạy `npx.cmd expo start`.

## Nội dung
Header 56px, thẻ sách dạng row (xem thêm Cart), chips wrap, grid 2 cột, badge absolute, giỏ nổi, Home ScrollView, Detail với thanh thêm giỏ cố định, Cart với tổng tiền cố định, tab bar 4 mục. Tab dùng state cục bộ chỉ để đổi giao diện theo phần nâng cao; nút thanh toán/thêm giỏ chỉ là giao diện tĩnh theo đề.

Ảnh bìa được thể hiện bằng khối màu và chữ/biểu tượng để ứng dụng hoạt động offline, không phụ thuộc ảnh bên ngoài.
