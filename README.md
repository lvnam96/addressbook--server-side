# birthdayStore
A front-end birthday managing/sorting app

# To-do list: Birthday Store

## Công dụng:
[x] Nhập ngày sinh của những người mình quan tâm, lưu trữ ghi chú cho từng người
[x] Chỉnh sửa info đã nhập cho từng người
[x] Xoá 1 người khỏi danh sách hoặc xoá hết
[x] Hiển thị ngày sinh của những ai có trong Tuần / Tháng này.
[ ] Nếu mình đã nhớ ngày sinh của người đó (hoặc đã tặng quà / chúc mừng sinh nhật) thì check vào để danh sách đó không phải hiện ra nữa.
[x] Lưu trữ offline
[x] Có thể backup / restore ra 1 file JSON.
[ ] Tạo file WOFF2 bằng tool của Google trên Ubuntu.
[ ] updating..

## Able to submit name, birthday & note for one person per submitting
**There should be a way to:**
[x] get data from input
[x] add person to the data: `{
  name: "",
  birthDay: [day,month,year],
  note: "",
  isRemembered: false
}`

## Sortable and displayable: birthdays in this week / month.
**There should be a way to:**
[x] **get** the present date
[x] check all the list, display those have birthday in this month
[x] check all the list, display those have birthday in this week (week will be an array of 7 days)

## Filterable: Nếu mình đã nhớ ngày sinh của người đó (hoặc đã tặng quà / chúc mừng sinh nhật) thì check vào để danh sách đó không phải hiện ra nữa.
**There should be a way to:**
[ ] filter out those who be checked at isRemembered checkbox (1 button)
[ ] filter out those who **not** be checked (1 button)
[x] display all (1 button)

## Editable
**There should be a way to:**
[x] edit name & note
[ ] edit birthday
[x] save those edited informations
[ ] edit by the original input form, not by creating new input elements for each item.

## Able to Delete / Delete All
**There should be a way to:**
[x] delete the person whose delete button is clicked
[x] create a delete button for everyone
[x] create a delete all button

## Able to backup / restore
**There should be a way to:**
[x] Backup: JSON.stringify(data) to a text file.
[x] Restore: JSON.parse(data) from a text file.


=======================================================================================
# To-do list: Keep-track-of-the-party
[ ] reject duplicate names (test with empty name).
[ ] change the checkbox's label from "Check here if this person confirmed" to "Confirmed" when the checkbox is checked.
[ ] hide the confirmed checkbox if the filter checkbox is checked.
[ ] add 2 radioboxes or a select element bellow the checkbox for "will/won't going" confirming, after the checkbox is checked. if "will going" the border will be green, otherwise it will be red (add a class for it).
[ ] add textarea to take a note/comment for each name.
[ ] use localStorage to save data locally.