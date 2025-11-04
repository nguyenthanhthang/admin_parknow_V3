# TỔNG QUAN API VÀ FLOW CỦA ADMIN

## Mục lục
1. [Authentication](#1-authentication)
2. [Parking Management](#2-parking-management)
3. [Manager Management](#3-manager-management)
4. [Account Management (Customer)](#4-account-management-customer)
5. [PayPal Management](#5-paypal-management)
6. [VnPay Management](#6-vnpay-management)
7. [Chart For Admin](#7-chart-for-admin)
8. [Business Profile Management](#8-business-profile-management)
9. [Wallet](#9-wallet)
10. [Booking Management For Admin](#10-booking-management-for-admin)
11. [Traffic Management](#11-traffic-management)
12. [Bill Management](#12-bill-management)
13. [Staff Account Management](#13-staff-account-management)
14. [Approve Parking](#14-approve-parking)
15. [Fee Management](#15-fee-management)
16. [Các Flow Chính](#các-flow-chính)
17. [SignalR Events](#signalr-events)

---

## 1. Authentication

### Controller: `AdminAuthenticationController`
- **Route**: `api/admin-authentication`
- **Authorization**: Không yêu cầu

### Endpoints

#### POST `/`
**Tên**: AdminLogin

**Mô tả**: API đăng nhập cho Admin

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: `ServiceResponse<AuthResponse>`

**Status Codes**:
- 200: Thành công
- 500: Internal server error

---

## 2. Parking Management

### Controller: `ParkingManagementController`
- **Route**: `api/admin/parking-management`
- **Authorization**: `[Authorize(Roles = "Admin")]`

### Endpoints

#### GET `/`
**Tên**: GetAllParkingForAdmin

**Mô tả**: Lấy danh sách tất cả bãi đỗ xe cho Admin

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetAllParkingForAdminResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### DELETE `/{parkingId}`
**Tên**: DisableOrEnableParkingForAdmin

**Mô tả**: Vô hiệu hóa hoặc kích hoạt bãi đỗ xe

**Path Parameters**:
- `parkingId` (int): ID của bãi đỗ xe

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadParkingInAdmin`

**Status Codes**:
- 204: No Content (Thành công)
- 400: Bad Request
- 500: Internal server error

---

## 3. Manager Management

### Controller: `ManagerManagementController`
- **Route**: `api/managers`
- **Authorization**: `[Authorize(Roles = "Admin")]` (một số endpoint cho phép Manager, Keeper)

### Endpoints

#### GET `/censorship`
**Tên**: GetCensorshipManagerAccountList

**Mô tả**: Lấy danh sách tài khoản Manager đã được duyệt

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<CensorshipManagerAccountResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### DELETE `/censorship/{managerId}`
**Tên**: DisableOrEnableCensorshipManagerAccount

**Mô tả**: Vô hiệu hóa hoặc kích hoạt tài khoản Manager đã duyệt

**Path Parameters**:
- `managerId` (int): ID của Manager

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadCensorshipManagerAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/censorship/{managerId}`
**Tên**: UpdateCensorshipManagerAccount

**Mô tả**: Cập nhật thông tin tài khoản Manager đã duyệt

**Path Parameters**:
- `managerId` (int): ID của Manager

**Request Body**: `UpdateCensorshipManagerAccountCommand`

**Authorization**: `[Authorize(Roles = "Admin,Manager,Keeper")]`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadCensorshipManagerAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### POST `/register/censorship`
**Tên**: CreateNewCensorshipManagerAccountList

**Mô tả**: Tạo tài khoản Manager mới (đã duyệt)

**Request Body**: `CreateNewCensorshipManagerAccountCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadCensorshipManagerAccounts`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### GET `/request/register-censorship`
**Tên**: GetRequestRegisterCensorshipManagerAccountList

**Mô tả**: Lấy danh sách yêu cầu đăng ký tài khoản Manager

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<RequestResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### PUT `/request/register-censorship/accept/{userId}`
**Tên**: AcceptRequestRegisterAccount

**Mô tả**: Chấp nhận yêu cầu đăng ký tài khoản Manager

**Path Parameters**:
- `userId` (int): ID của User

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadRequestRegisterCensorshipManagerAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/request/register-censorship/decline/{userId}`
**Tên**: DeclineRequestRegisterAccount

**Mô tả**: Từ chối yêu cầu đăng ký tài khoản Manager

**Path Parameters**:
- `userId` (int): ID của User

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadRequestRegisterCensorshipManagerAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/non-censorship`
**Tên**: GetNonCensorshipManagerAccountList

**Mô tả**: Lấy danh sách tài khoản Manager chưa được duyệt

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<NonCensorshipManagerAccountResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 4. Account Management (Customer)

### Controller: `AccountController`
- **Route**: `api/accounts`
- **Authorization**: `[Authorize(Roles = "Admin")]`

### Endpoints

#### GET `/customer`
**Tên**: GetListCustomer

**Mô tả**: Lấy danh sách tất cả Customer

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetListCustomerResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/customer/{userId}`
**Tên**: GetCustomerByUserId

**Mô tả**: Lấy thông tin chi tiết Customer theo User ID

**Path Parameters**:
- `userId` (int): ID của User

**Response**: `ServiceResponse<GetCustomerByIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### PUT `/{userId}`
**Tên**: DisableOrEnableAccount

**Mô tả**: Vô hiệu hóa hoặc kích hoạt tài khoản Customer

**Path Parameters**:
- `userId` (int): ID của User

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadCustomerList`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

---

## 5. PayPal Management

### Controller: `PaypalController`
- **Route**: `api/paypal-management`
- **Authorization**: `[Authorize(Roles = "Admin,Manager")]`

### Endpoints

#### POST `/`
**Tên**: CreateNewPaypalForAccount

**Mô tả**: Tạo tài khoản PayPal mới

**Request Body**: `CreateNewPaypalCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadPaypalList`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### DELETE `/{paypalId}`
**Tên**: DeletePayPal

**Mô tả**: Xóa tài khoản PayPal

**Path Parameters**:
- `paypalId` (int): ID của PayPal

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadPaypalList`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/{paypalId}`
**Tên**: UpdatePaypal

**Mô tả**: Cập nhật thông tin tài khoản PayPal

**Path Parameters**:
- `paypalId` (int): ID của PayPal

**Request Body**: `UpdatePaypalCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadPaypalList`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/{managerId}`
**Tên**: GetPaypalInforByManagerId

**Mô tả**: Lấy thông tin PayPal theo Manager ID

**Path Parameters**:
- `managerId` (int): ID của Manager

**Response**: `ServiceResponse<GetPaypalByManagerIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/`
**Tên**: GetPaypalList

**Mô tả**: Lấy danh sách tất cả tài khoản PayPal

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetListPaypalResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 6. VnPay Management

### Controller: `VnPayManagement`
- **Route**: `api/vnpay`
- **Authorization**: `[Authorize(Roles = "Admin,Manager")]` (một số endpoint AllowAnonymous)

### Endpoints

#### POST `/`
**Tên**: CreateNewVnPay

**Mô tả**: Tạo tài khoản VnPay mới

**Request Body**: `CreateNewVnPayCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadVnPays`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### PUT `/{vnPayId}`
**Tên**: UpdateVnPay

**Mô tả**: Cập nhật thông tin tài khoản VnPay

**Path Parameters**:
- `vnPayId` (int): ID của VnPay

**Request Body**: `UpdateVnPayCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadVnPays`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### DELETE `/{vnPayId}`
**Tên**: DeleteVnPay

**Mô tả**: Xóa tài khoản VnPay

**Path Parameters**:
- `vnPayId` (int): ID của VnPay

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadVnPays`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/user/{userId}`
**Tên**: GetVnpayInforByManagerId

**Mô tả**: Lấy thông tin VnPay theo User ID

**Path Parameters**:
- `userId` (int): ID của User

**Response**: `ServiceResponse<GetVnPayByUserIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/{vnPayId}`
**Tên**: GetVnPayById

**Mô tả**: Lấy thông tin VnPay theo ID

**Path Parameters**:
- `vnPayId` (int): ID của VnPay

**Authorization**: `[AllowAnonymous]`

**Response**: `ServiceResponse<GetVnPayByIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 7. Chart For Admin

### Controller: `ChartForAdminController`
- **Route**: `api/admin/chart`

### Endpoints

#### GET `/business/total`
**Tên**: SumOfBusinessAccount

**Mô tả**: Lấy tổng số tài khoản Business

**Response**: `ServiceResponse<int>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/customer/total`
**Tên**: SumOfCustomer

**Mô tả**: Lấy tổng số Customer

**Response**: `ServiceResponse<int>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/line/bill/month-revenue`
**Tên**: SumOfFeeFromBusiness

**Mô tả**: Lấy doanh thu theo tháng từ Business (biểu đồ đường)

**Response**: `ServiceResponse<IEnumerable<SumOfFeeFromBusinessResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 8. Business Profile Management

### Controller: `BusinessProfileManagementController`
- **Route**: `api/business-profile-management`
- **Authorization**: `[Authorize(Roles = "Admin")]`

### Endpoints

#### GET `/business-profile/{businessProfileId}`
**Tên**: GetBusinessProfileById

**Mô tả**: Lấy thông tin chi tiết Business Profile theo ID

**Path Parameters**:
- `businessProfileId` (int): ID của Business Profile

**Response**: `ServiceResponse<GetBusinessProfileByIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### DELETE `/business-profile/{businessProfileId}`
**Tên**: DeleteBusinessProfile

**Mô tả**: Xóa Business Profile

**Path Parameters**:
- `businessProfileId` (int): ID của Business Profile

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadBusinessProfileInAdmin`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/`
**Tên**: GetListBusinessProfile

**Mô tả**: Lấy danh sách tất cả Business Profile

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetListBusinessProfileResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 9. Wallet

### Controller: `WalletController`
- **Route**: `api/admin-wallet`
- **Authorization**: `[Authorize(Roles = "Admin")]`

### Endpoints

#### GET `/`
**Tên**: GetWalletOfAdmin

**Mô tả**: Lấy thông tin ví của Admin

**Response**: `ServiceResponse<GetWalletForAdminResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 10. Booking Management For Admin

### Controller: `BookingManagementForAdminController`
- **Route**: `api/admin/booking-management`

### Endpoints

#### GET `/`
**Tên**: GetAllBookingForAdmin

**Mô tả**: Lấy danh sách tất cả Booking cho Admin

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetAllBookingForAdminQueryHandler>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 11. Traffic Management

### Controller: `TrafficManagementController`
- **Route**: `api/traffics`
- **Authorization**: `[Authorize(Roles = "Admin")]`

### Endpoints

#### GET `/`
**Tên**: GetListTraffics

**Mô tả**: Lấy danh sách tất cả Traffic

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetListTrafficResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/traffic/{trafficId}`
**Tên**: GetTrafficById

**Mô tả**: Lấy thông tin chi tiết Traffic theo ID

**Path Parameters**:
- `trafficId` (int): ID của Traffic

**Response**: `ServiceResponse<GetTrafficResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### POST `/traffic`
**Tên**: CreateNewTraffic

**Mô tả**: Tạo Traffic mới

**Request Body**: `CreateNewTrafficCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadTrafficInAdmin`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### DELETE `/traffic/{trafficId}`
**Tên**: DisableOrEnableTraffic

**Mô tả**: Vô hiệu hóa hoặc kích hoạt Traffic

**Path Parameters**:
- `trafficId` (int): ID của Traffic

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadTrafficInAdmin`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/traffic/{trafficId}`
**Tên**: UpdateTraffic

**Mô tả**: Cập nhật thông tin Traffic

**Path Parameters**:
- `trafficId` (int): ID của Traffic

**Request Body**: `UpdateTrafficCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadTrafficInAdmin`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

---

## 12. Bill Management

### Controller: `BillManagementController`
- **Route**: `api/bill-management`

### Endpoints

#### GET `/`
**Tên**: GetAllBills

**Mô tả**: Lấy danh sách tất cả Bill

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetAllBillsResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 13. Staff Account Management

### Controller: `StaffAccountManagementController`
- **Route**: `api/staff-account-management`
- **Authorization**: `[Authorize(Roles = "Admin")]` (một số endpoint cho phép Staff)

### Endpoints

#### POST `/register`
**Tên**: CreateNewStaffAccount

**Mô tả**: Tạo tài khoản Staff mới

**Request Body**: `CreateNewStaffAccountCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadStaffAccounts`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### GET `/`
**Tên**: GetListStaffAccount

**Mô tả**: Lấy danh sách tất cả tài khoản Staff

**Query Parameters**:
- `pageNo` (int): Số trang
- `pageSize` (int): Kích thước trang

**Response**: `ServiceResponse<IEnumerable<GetListStaffAccountResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### PUT `/`
**Tên**: UpdateStaffAccount

**Mô tả**: Cập nhật thông tin tài khoản Staff

**Request Body**: `UpdateStaffAccountCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadStaffAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/password`
**Tên**: UpdateStaffAccountPassword

**Mô tả**: Cập nhật mật khẩu cho Staff

**Request Body**: `UpdatePasswordForStaffCommand`

**Response**: `ServiceResponse<string>`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### DELETE `/{staffId}`
**Tên**: DisableOrEnableStaffAccount

**Mô tả**: Vô hiệu hóa hoặc kích hoạt tài khoản Staff

**Path Parameters**:
- `staffId` (int): ID của Staff

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadStaffAccounts`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/{staffId}`
**Tên**: GetStaffAccountById

**Mô tả**: Lấy thông tin chi tiết tài khoản Staff theo ID

**Path Parameters**:
- `staffId` (int): ID của Staff

**Authorization**: `[Authorize(Roles = "Admin,Staff")]`

**Response**: `ServiceResponse<GetStaffAccountByIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

---

## 14. Approve Parking

### Controller: `ApproveParkingController`
- **Route**: `api/approve-parkings`

### Endpoints

#### GET `/all-field-information/{parkingId}`
**Tên**: GetFieldInforByParkingId

**Mô tả**: Lấy thông tin tất cả các field của Parking theo Parking ID

**Path Parameters**:
- `parkingId` (int): ID của Parking

**Response**: `ServiceResponse<GetFieldInforByParkingIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/request`
**Tên**: GetAllParkingRequest

**Mô tả**: Lấy danh sách tất cả yêu cầu đăng ký Parking

**Query Parameters**:
- `PageNo` (int): Số trang
- `PageSize` (int): Kích thước trang

**Response**: `ServiceResponse<GetAllParkingRequestResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/request/waiting-accept`
**Tên**: GetListParkingWaitingToAccept

**Mô tả**: Lấy danh sách Parking đang chờ duyệt

**Query Parameters**:
- `PageNo` (int): Số trang
- `PageSize` (int): Kích thước trang

**Response**: `ServiceResponse<GetListParkingWaitingToAcceptResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### GET `/parking-information-tab/{parkingId}`
**Tên**: GetParkingInformationTab

**Mô tả**: Lấy thông tin Parking cho tab thông tin

**Path Parameters**:
- `parkingId` (int): ID của Parking

**Response**: `ServiceResponse<GetParkingInformationTabResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### PUT `/request/accept`
**Tên**: AcceptParkingRequest

**Mô tả**: Chấp nhận yêu cầu đăng ký Parking

**Request Body**: `AcceptParkingRequestCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadParkingInAdmin`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### PUT `/request/decline`
**Tên**: DeclineParkingRequest

**Mô tả**: Từ chối yêu cầu đăng ký Parking

**Request Body**: `DeclineParkingRequestCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadParkingInAdmin`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

---

## 15. Fee Management

### Controller: `FeeManagementController`
- **Route**: `api/fee-management`

### Endpoints

#### POST `/`
**Tên**: CreateNewFee

**Mô tả**: Tạo Fee mới

**Request Body**: `CreateNewFeeCommand`

**Response**: `ServiceResponse<int>`

**SignalR Event**: `LoadFee`

**Status Codes**:
- 201: Created
- 400: Bad Request
- 500: Internal server error

#### GET `/`
**Tên**: GetListFee

**Mô tả**: Lấy danh sách tất cả Fee

**Response**: `ServiceResponse<IEnumerable<GetListFeeResponse>>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### DELETE `/{feeId}`
**Tên**: DeleteFee

**Mô tả**: Xóa Fee

**Path Parameters**:
- `feeId` (int): ID của Fee

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadFee`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

#### GET `/{feeId}`
**Tên**: GetFeeById

**Mô tả**: Lấy thông tin chi tiết Fee theo ID

**Path Parameters**:
- `feeId` (int): ID của Fee

**Response**: `ServiceResponse<GetFeeByIdResponse>`

**Status Codes**:
- 200: OK
- 404: Not Found
- 500: Internal server error

#### PUT `/`
**Tên**: UpdateFee

**Mô tả**: Cập nhật thông tin Fee

**Request Body**: `UpdateFeeCommand`

**Response**: `ServiceResponse<string>`

**SignalR Event**: `LoadFee`

**Status Codes**:
- 204: No Content
- 400: Bad Request
- 500: Internal server error

---

## CÁC FLOW CHÍNH

### Flow 1: Quản lý tài khoản Manager

**Mục đích**: Quản lý toàn bộ vòng đời tài khoản Manager từ đăng ký đến hoạt động

**Các bước**:

1. **Xem danh sách yêu cầu đăng ký**
   - Endpoint: `GET /api/managers/request/register-censorship`
   - Admin xem các yêu cầu đăng ký tài khoản Manager mới

2. **Duyệt hoặc từ chối yêu cầu**
   - Chấp nhận: `PUT /api/managers/request/register-censorship/accept/{userId}`
   - Từ chối: `PUT /api/managers/request/register-censorship/decline/{userId}`
   - Admin xem xét và quyết định duyệt/từ chối

3. **Xem danh sách Manager đã duyệt**
   - Endpoint: `GET /api/managers/censorship`
   - Xem danh sách Manager đã được duyệt và đang hoạt động

4. **Quản lý tài khoản Manager**
   - Tạo mới: `POST /api/managers/register/censorship`
   - Cập nhật: `PUT /api/managers/censorship/{managerId}`
   - Vô hiệu/kích hoạt: `DELETE /api/managers/censorship/{managerId}`

5. **Xem danh sách Manager chưa duyệt**
   - Endpoint: `GET /api/managers/non-censorship`
   - Xem danh sách Manager chưa được duyệt

---

### Flow 2: Quản lý Parking

**Mục đích**: Quản lý và duyệt các yêu cầu đăng ký bãi đỗ xe

**Các bước**:

1. **Xem danh sách yêu cầu đăng ký Parking**
   - Tất cả yêu cầu: `GET /api/approve-parkings/request`
   - Yêu cầu chờ duyệt: `GET /api/approve-parkings/request/waiting-accept`

2. **Xem chi tiết thông tin Parking**
   - Thông tin field: `GET /api/approve-parkings/all-field-information/{parkingId}`
   - Tab thông tin: `GET /api/approve-parkings/parking-information-tab/{parkingId}`

3. **Duyệt hoặc từ chối yêu cầu**
   - Chấp nhận: `PUT /api/approve-parkings/request/accept`
   - Từ chối: `PUT /api/approve-parkings/request/decline`

4. **Quản lý Parking đã được duyệt**
   - Xem danh sách: `GET /api/admin/parking-management`
   - Vô hiệu/kích hoạt: `DELETE /api/admin/parking-management/{parkingId}`

---

### Flow 3: Quản lý Payment Methods

**Mục đích**: Quản lý các phương thức thanh toán (PayPal và VnPay)

**Các bước**:

1. **Quản lý PayPal**
   - Tạo mới: `POST /api/paypal-management`
   - Xem danh sách: `GET /api/paypal-management`
   - Xem theo Manager: `GET /api/paypal-management/{managerId}`
   - Cập nhật: `PUT /api/paypal-management/{paypalId}`
   - Xóa: `DELETE /api/paypal-management/{paypalId}`

2. **Quản lý VnPay**
   - Tạo mới: `POST /api/vnpay`
   - Xem theo User: `GET /api/vnpay/user/{userId}`
   - Xem theo ID: `GET /api/vnpay/{vnPayId}`
   - Cập nhật: `PUT /api/vnpay/{vnPayId}`
   - Xóa: `DELETE /api/vnpay/{vnPayId}`

---

### Flow 4: Dashboard & Thống kê

**Mục đích**: Xem tổng quan hệ thống và các thống kê quan trọng

**Các bước**:

1. **Xem tổng quan số lượng**
   - Tổng Business: `GET /api/admin/chart/business/total`
   - Tổng Customer: `GET /api/admin/chart/customer/total`

2. **Xem doanh thu**
   - Doanh thu theo tháng: `GET /api/admin/chart/line/bill/month-revenue`

3. **Xem ví Admin**
   - Thông tin ví: `GET /api/admin-wallet`

4. **Xem Booking và Bills**
   - Danh sách Booking: `GET /api/admin/booking-management`
   - Danh sách Bills: `GET /api/bill-management`

---

### Flow 5: Quản lý hệ thống

**Mục đích**: Quản lý các cấu hình và tài khoản hệ thống

**Các bước**:

1. **Quản lý Fee (Phí)**
   - Tạo mới: `POST /api/fee-management`
   - Xem danh sách: `GET /api/fee-management`
   - Xem chi tiết: `GET /api/fee-management/{feeId}`
   - Cập nhật: `PUT /api/fee-management`
   - Xóa: `DELETE /api/fee-management/{feeId}`

2. **Quản lý Traffic (Lưu lượng)**
   - Tạo mới: `POST /api/traffics/traffic`
   - Xem danh sách: `GET /api/traffics`
   - Xem chi tiết: `GET /api/traffics/traffic/{trafficId}`
   - Cập nhật: `PUT /api/traffics/traffic/{trafficId}`
   - Vô hiệu/kích hoạt: `DELETE /api/traffics/traffic/{trafficId}`

3. **Quản lý Staff Account**
   - Tạo mới: `POST /api/staff-account-management/register`
   - Xem danh sách: `GET /api/staff-account-management`
   - Xem chi tiết: `GET /api/staff-account-management/{staffId}`
   - Cập nhật: `PUT /api/staff-account-management`
   - Cập nhật mật khẩu: `PUT /api/staff-account-management/password`
   - Vô hiệu/kích hoạt: `DELETE /api/staff-account-management/{staffId}`

4. **Quản lý Customer Account**
   - Xem danh sách: `GET /api/accounts/customer`
   - Xem chi tiết: `GET /api/accounts/customer/{userId}`
   - Vô hiệu/kích hoạt: `PUT /api/accounts/{userId}`

5. **Quản lý Business Profile**
   - Xem danh sách: `GET /api/business-profile-management`
   - Xem chi tiết: `GET /api/business-profile-management/business-profile/{businessProfileId}`
   - Xóa: `DELETE /api/business-profile-management/business-profile/{businessProfileId}`

---

## SignalR Events

Hệ thống sử dụng SignalR để real-time update các danh sách khi có thay đổi. Các event được gửi đến tất cả clients:

| Event Name | Mô tả | Kích hoạt khi |
|------------|-------|--------------|
| `LoadParkingInAdmin` | Cập nhật danh sách Parking | Duyệt/từ chối Parking, vô hiệu/kích hoạt Parking |
| `LoadCensorshipManagerAccounts` | Cập nhật danh sách Manager đã duyệt | Tạo/cập nhật/vô hiệu Manager đã duyệt |
| `LoadRequestRegisterCensorshipManagerAccounts` | Cập nhật yêu cầu đăng ký Manager | Chấp nhận/từ chối yêu cầu đăng ký |
| `LoadCustomerList` | Cập nhật danh sách Customer | Vô hiệu/kích hoạt tài khoản Customer |
| `LoadPaypalList` | Cập nhật danh sách PayPal | Tạo/cập nhật/xóa PayPal |
| `LoadVnPays` | Cập nhật danh sách VnPay | Tạo/cập nhật/xóa VnPay |
| `LoadBusinessProfileInAdmin` | Cập nhật Business Profile | Xóa Business Profile |
| `LoadTrafficInAdmin` | Cập nhật danh sách Traffic | Tạo/cập nhật/vô hiệu Traffic |
| `LoadStaffAccounts` | Cập nhật danh sách Staff | Tạo/cập nhật/vô hiệu Staff |
| `LoadFee` | Cập nhật danh sách Fee | Tạo/cập nhật/xóa Fee |

---

## Response Format

Tất cả các API đều trả về format chuẩn `ServiceResponse<T>`:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    // Response data
  }
}
```

**Các Status Code phổ biến**:
- `200`: OK - Thành công
- `201`: Created - Tạo mới thành công
- `204`: No Content - Cập nhật/xóa thành công
- `400`: Bad Request - Lỗi validation hoặc request không hợp lệ
- `404`: Not Found - Không tìm thấy resource
- `500`: Internal Server Error - Lỗi server

---

## Authentication & Authorization

- Hầu hết các API yêu cầu `[Authorize(Roles = "Admin")]`
- Một số API cho phép nhiều role: `[Authorize(Roles = "Admin,Manager")]`
- API đăng nhập không yêu cầu authentication
- Một số API có `[AllowAnonymous]` (ví dụ: `GetVnPayById`)

---

## Notes

1. **Phân trang**: Hầu hết các API danh sách đều hỗ trợ phân trang với `pageNo` và `pageSize`
2. **SignalR**: Các API thay đổi dữ liệu sẽ gửi SignalR event để cập nhật real-time
3. **Validation**: Các Command đều có validation riêng
4. **Error Handling**: Tất cả API đều có try-catch và trả về error message phù hợp
5. **Response Message**: Message thành công thường là "Thành công"

---

**Ngày tạo**: 2024
**Version**: 1.0

