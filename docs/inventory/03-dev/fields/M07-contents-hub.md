# M07 內容中心 — 欄位控制規格(開發)

> 資料來源:後台前端程式(版本 2.8.2)靜態分析,2026-10-05。尚未經登入後實際畫面查驗的內容,狀態標為「待實機查驗」。

- **送出參數**:前端送到 API 的欄位名稱(FormData / JSON key),空白表示靜態分析無法確定或屬於篩選條件。
- 欄位名稱後的 ⁱ 表示標籤取自元件旁的文字,不是元件本身的 label,需實機確認。
- **驗證規則**:前端表單驗證;後端驗證需登入後以實際送出結果補充(只讀查驗不送出,故標為未驗證)。

## M07-P01 announcements(新增)`/announcements/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `announcement_name` | 是 | 自訂:is required;自訂:must not exceed {max} characters;長度限制 .length<=100 |  | required="" | 頁面 |
| 2 | Category | VAutocomplete | `announcement_category_id` | 是 | 自訂:is required;自訂:Please enter a valid integer | [] | required="" item-title="name" item-value="id" | 頁面 |
| 3 | Statusⁱ | VSwitch | `active_status` | 否 |  |  | color="success" | 人工補全 |
| 4 | Enable Popupⁱ | VSwitch | `is_enable_pop_up` | 否 |  |  | 說明:開啟後才顯示媒體類型、影片連結 color="primary" | 人工補全 |
| 5 | Media Type | VAutocomplete | `media_type` | 否 |  | [{name:"Image",value:"image"},{name:"Video",value:"video"}] | item-title="name" item-value="value" | 頁面 |
| 6 | Video Link | AppTextField | `video_link` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 7 | Banner Imageⁱ |  | `banner` | 否 |  |  | 說明:開啟彈窗且媒體類型為 video 時不送出,改送 video_link accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml" type="file" | 人工補全 |
| 8 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 人工補全 |
| 9 | Content | TiptapEditor | `announcement_content` | 是 | 自訂:is required |  | 說明:送出前以 Base64 編碼 HTML rows="5" | 人工補全 |

**API**:`GET /announcement_categories`、`POST /announcement`

## M07-P02 Announcements(列表)`/announcements/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `announcement_name` | 否 |  |  |  | 頁面 |
| 2 | Category | VAutocomplete |  | 否 |  | [] | clearable="" item-title="name" item-value="id" | 頁面 |
| 3 | Status | VAutocomplete | `active_status` | 否 |  | [{id:E.ACTIVE,name:"Active"},{id:E.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Popup | VAutocomplete | `is_enable_pop_up` | 否 |  | [{id:1,name:"Yes"},{id:0,name:"No"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 5 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 6 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Name | `announcement_name` | 是 |
| 2 | Category | `announcement_category_name` | 否 |
| 3 | Enable Popup | `is_enable_pop_up` | 是 |
| 4 | Status | `active_status` | 是 |
| 5 | Sequence | `seq_no` | 是 |
| 6 | Start Date | `start_date` | 是 |
| 7 | End Date | `end_date` | 是 |
| 8 | Created At | `created_at` | 是 |
| 9 | Actions | `actions` | 否 |

**API**:`GET /announcement_categories`、`GET /announcement`、`POST /announcement/sequence/update`

## M07-P03 announcements(編輯)`/announcements/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `announcement_name` | 是 | 自訂:is required;自訂:must not exceed {max} characters;長度限制 .length<=100 |  | disabled=e(p) required="" | 頁面 |
| 2 | Category | VAutocomplete | `announcement_category_id` | 是 | 自訂:is required | [] | disabled=e(p) required="" item-title="name" item-value="id" | 頁面 |
| 3 | Statusⁱ | VSwitch | `active_status` | 否 |  |  | disabled=e(p) color="success" | 人工補全 |
| 4 | Enable Popupⁱ | VSwitch | `is_enable_pop_up` | 否 |  |  | disabled=e(p) color="primary" | 人工補全 |
| 5 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 人工補全 |
| 6 | Media Type | VAutocomplete | `media_type` | 否 |  | [{name:"Image",value:"image"},{name:"Video",value:"video"}] | disabled=e(p) item-title="name" item-value="value" | 頁面 |
| 7 | Video Link | AppTextField | `video_link` | 是 | 必填;URL 格式(http/https) |  | disabled=e(p) | 頁面 |
| 8 | Banner Imageⁱ |  | `banner` | 否 |  |  | 說明:未保留原圖時送 remove_banner=1 accept="image/jpeg,image/png,image/jpg,image/gif,image/svg+xml" type="file" | 人工補全 |
| 9 | Content | TiptapEditor | `announcement_content` | 是 | 自訂:is required |  | 說明:送出前以 Base64 編碼 HTML disabled=e(p) rows="5" | 人工補全 |

**API**:`GET /announcement_categories`、`GET /announcement/:id`、`POST /announcement/:id`

## M07-P04 Announcements(詳情)`/announcements/view/:id`

**API**:`GET /announcement/:id`

## M07-P05 banners(新增)`/banners/add`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `advertisement_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Position | VAutocomplete | `advertisement_position_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="advertisement_position_id" | 頁面 |
| 3 | Page | VAutocomplete | `advertisement_page_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="advertisement_page_id" | 頁面 |
| 4 | Statusⁱ | VSwitch | `advertisement_status` | 否 |  |  |  | 頁面 |
| 5 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 6 | Media Type | VAutocomplete | `media_type` | 是 | 必填 | [{name:"Image",value:"image"},{name:"Video",value:"video"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 7 | Video Link (Large) | AppTextField | `video_link_large` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 8 | Video Link (Medium) | AppTextField | `video_link_medium` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 9 | Video Link (Small) | AppTextField | `video_link_small` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 10 | Desktop(1368x360) | VFileInput | `banner_image_large` | 否 |  |  | accept="image/png,image/jpeg,image/jpg" | 頁面 |
| 11 | Tablet(768x360) | VFileInput | `banner_image_medium` | 否 |  |  | accept="image/png,image/jpeg,image/jpg" | 頁面 |
| 12 | Mobile(500x500) | VFileInput | `banner_image_small` | 否 |  |  | accept="image/png,image/jpeg,image/jpg" | 頁面 |

**API**:`POST /advertisement`、`GET /advertisement_position_list`、`GET /advertisement_page_list`

## M07-P06 Banners(列表)`/banners/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `name` | 否 |  |  |  | 頁面 |
| 2 | Page | VAutocomplete | `advertisement_page_id` | 否 |  | API 動態載入 | clearable="" item-title="name" item-value="advertisement_page_id" | 頁面 |
| 3 | Status | VAutocomplete | `active_status` | 否 |  | [{id:p.ACTIVE,name:"Active"},{id:p.INACTIVE,name:"Inactive"}] | clearable="" item-title="name" item-value="id" | 頁面 |
| 4 | Start Date (FROM) ~ Start Date (TO) | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 5 | Items per page | AppSelect | `value` | 否 |  | [5,10,20,25,50,{title:e."All",value:"all"}] |  | 頁面 |

**表格欄位**

| # | 欄位標題 | 資料 key | 可排序 |
|---|---|---|---|
| 1 | Name | `advertisement_name` | 是 |
| 2 | Position | `advertisement_position.advertisement_position_name` | 是 |
| 3 | Page | `advertisement_page.advertisement_page_name` | 是 |
| 4 | Sequence | `seq_no` | 是 |
| 5 | Start Date | `start_date` | 是 |
| 6 | End Date | `end_date` | 是 |
| 7 | Status | `active_status` | 是 |
| 8 | Created At | `created_at` | 是 |
| 9 | Updated At | `updated_at` | 是 |
| 10 | Actions | `actions` | 否 |

**API**:`GET /advertisement`、`PUT /advertisement/status/:id`、`GET /advertisement_page_list`、`POST /advertisement/sequence/update`

## M07-P07 banners(編輯)`/banners/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Name | AppTextField | `advertisement_name` | 是 | 必填 |  |  | 頁面 |
| 2 | Position | VAutocomplete | `advertisement_position_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="advertisement_position_id" | 頁面 |
| 3 | Page | VAutocomplete | `advertisement_page_id` | 是 | 必填 | [] | clearable="" item-title="name" item-value="advertisement_page_id" | 頁面 |
| 4 | Statusⁱ | VSwitch | `advertisement_status` | 否 |  |  |  | 頁面 |
| 5 | Start Date ~ End Date | DateRangePicker | `start_date ~ end_date` | 否 |  |  |  | 頁面 |
| 6 | Media Type | VAutocomplete | `media_type` | 是 | 必填 | [{name:"Image",value:"image"},{name:"Video",value:"video"}] | clearable="" item-title="name" item-value="value" | 頁面 |
| 7 | Video Link (Large) | AppTextField | `video_link_large` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 8 | Video Link (Medium) | AppTextField | `video_link_medium` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 9 | Video Link (Small) | AppTextField | `video_link_small` | 是 | 必填;URL 格式(http/https) |  |  | 頁面 |
| 10 | Desktop(1368x360) | VFileInput | `banner_image_large` | 否 |  |  | accept="image/*" | 頁面 |
| 11 | Tablet(768x360) | VFileInput | `banner_image_medium` | 否 |  |  | accept="image/*" | 頁面 |
| 12 | Mobile(500x500) | VFileInput | `banner_image_small` | 否 |  |  | accept="image/*" | 頁面 |

**API**:`GET /advertisement/:id`、`POST /advertisement/:id`、`GET /advertisement_position_list`、`GET /advertisement_page_list`

## M07-P08 banners(詳情)`/banners/view/:id`

**API**:`GET /advertisement/:id`

## M07-P09 Responsible Gaming(列表)`/responsible-gaming/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Language | VAutocomplete | `modelValue` | 否 |  | API 動態載入 | item-title="general_name" item-value=i | 頁面 |

**API**:`GET /get_language`

## M07-P10 Title(編輯)`/responsible-gaming/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title | AppTextField | `title` | 是 | 必填 |  |  | 頁面 |
| 2 | Contentⁱ | TiptapEditor | —(只顯示,不送出;資料來自 `content`) | 否 |  |  |  | 頁面 |

**API**:`PUT /responsible_gaming`

## M07-P11 Status Declaration(列表)`/status-declaration/list`

**API**:`GET /show_status_declaration`

## M07-P12 status-declaration(編輯)`/status-declaration/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Statusⁱ | VSwitch | `active_status` | 否 |  |  | disabled=t(_) color="success" | 頁面 |
| 2 | Contentⁱ | TiptapEditor | `status_declaration_content` | 否 |  |  | disabled=t(_) rows="5" | 頁面 |

**API**:`GET /show_status_declaration`、`PUT /update_status_declaration/:id`

## M07-P13 Terms and Conditions(列表)`/terms-and-conditions/list`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Language | VAutocomplete | `modelValue` | 否 |  | API 動態載入 | item-title="general_name" item-value=i | 頁面 |

**API**:`GET /get_language`

## M07-P14 Title(編輯)`/terms-and-conditions/update/:id`

| # | 欄位 | 元件 | 送出參數 | 必填 | 驗證規則 | 選項來源 | 其他控制 | 來源 |
|---|---|---|---|---|---|---|---|---|
| 1 | Title | AppTextField | `title` | 是 | 必填 |  |  | 頁面 |
| 2 | Contentⁱ | TiptapEditor | —(只顯示,不送出;資料來自 `content`) | 否 |  |  |  | 頁面 |

**API**:`PUT /term_and_condition`

