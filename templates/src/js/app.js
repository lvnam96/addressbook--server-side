const BIRTH_STORE = (function() {
    let birthdayList,
        IDList,
        maxID,
        isModified = false,
        isStorageAvailable,
        time,
        methods = {};

    time = (function() {
        let newDateObj = new Date(),
            isLeap = function (year) {// tính năm nhuận
              if (year % 4 || (year % 100 === 0 && year % 400)) {return 0;}
              else {return 1;}
            },
            howManyDaysInMonth = function (month, year) {// tính ngày trong tháng
              return month === 2 ? (28 + isLeap(year)) : (31 - (month - 1) % 7 % 2);
            };

        // this is a local method of a local obj (newDateObj)
        newDateObj.myGetDay = function() {//  myGetDay(): trả về thứ trong tuần, ngày đầu trong tuần là thứ 2, 0-based
          let day = this.getDay();// getDay() trả về thứ trong tuần, ngày đầu trong tuần là chủ nhật, 0-based
          return day === 0 ? 6 : day - 1;
        };

        return {
          curDay: newDateObj.getDate(),
          curDate: newDateObj.myGetDay(), 
          curMonth: newDateObj.getMonth() + 1,
          curYear: newDateObj.getFullYear(),
          daysInMonth: howManyDaysInMonth
        };
    }());

    isStorageAvailable = (function storageAvailable(type) {
        try {
            let storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch(e) {
            return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
        }
    }('localStorage'));

    methods.shouldBeSaved = function() {
        return isModified;
    };
    methods.dontSaveDataToLocalStorageAgain = function() {
        isModified = false;
    };
    methods.getBirthList = function() {
        return birthdayList;
    };
    methods.listLength = function() {
        return birthdayList.length;
    };
    // https://gist.github.com/lvnam96/592fa2a61bfc7de728ea6785197dae13
    methods.getRandomCode = function(string_length) {
        let text = "";
        const POSSIBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            POSSIBLE_SCOPE = POSSIBLE.length;
      
        for (let i = 0; i < string_length; i += 1) {
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE_SCOPE));
        }

        return text;
    };
    methods.addData = function(newPersonObj) {
        birthdayList.push(newPersonObj);
        isModified = true;
    };
    methods.find = function(IDList, callbackFunc, callbackObj) {
        let len = birthdayList.length;

        if (Array.isArray(IDList)) {
            IDList.forEach(function(IDStr) {
                birthdayList.forEach(function(birthElement, index) {
                    if (birthElement.ID === IDStr) {
                        if (callbackFunc && typeof callbackFunc === 'function') {
                            if (callbackObj && typeof callbackObj === 'object') {
                                callbackFunc.call(callbackObj, index);
                            } else {
                                callbackFunc(index);
                            }
                        }
                    }
                });
            });
        } else if (typeof IDList === 'string') {// pass ID string when edit or just need to find index of the only person who has that ID in birthdayList
            for (let i = 0; i < len; i += 1) {
                if (birthdayList[i].ID === IDList) {
                    if (callbackFunc && typeof callbackFunc === 'function') {
                        if (callbackObj && typeof callbackObj === 'object') {
                            callbackFunc.call(callbackObj, i);
                        } else {
                            callbackFunc(i);
                        }
                    }
                    return i;
                }
            }
        }

        if (isModified) {
            let updatedData = birthdayList.filter(function(element, index) {
                return element;
            });
            this.replaceData(updatedData);
        }
    };
    methods.editData = function(newNameStr, newBirthdayArr, newNoteStr, idx) {
    // this func editData is only currying func (partial application) in this app.
        if (typeof idx === 'undefined') {
            return function(idx) {
                birthdayList[idx].name = newNameStr;
                birthdayList[idx].birthDay = newBirthdayArr;
                birthdayList[idx].note = newNoteStr;
                isModified = true;
            };
        }
        birthdayList[idx].name = newNameStr;
        birthdayList[idx].birthDay = newBirthdayArr;
        birthdayList[idx].note = newNoteStr;
        isModified = true;
    };
    methods.rmData = function(idx) {
    // birthdayList.splice(idx, 1);
        delete birthdayList[idx];
        isModified = true;
    };
    methods.rmAllData = function() {
        birthdayList = [];
        isModified = true;
    };
    methods.saveDataToLocalStorage = function() {
        localStorage.birthdayList = JSON.stringify(birthdayList);
    };
    methods.replaceData = function(newData) {
        birthdayList = newData;
    };
    methods.rangeOfWeek = function(testDay, testDateNum) {//Calculate range (array) of days in current week
        let result = [],
            today = testDay || time.curDay,//ngày trong tháng, 1-based
            toDate = testDateNum > -1 ? testDateNum : time.curDate,
            thisMonth = time.curMonth,
            thisYear = time.curYear,
            daysInMonth = time.daysInMonth,
            dayInLastMonth = (thisMonth - 1) === 0 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear),
            dayInThisMonth = daysInMonth(thisMonth, thisYear),
            dayInNextMonth = (thisMonth + 1) === 13 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear),
            startDayInWeek = today - toDate + ((today - toDate < 1) ? dayInLastMonth : 0),
            endDayInWeek = today + 7 - toDate - 1 - ((today + 7 - toDate - 1 > dayInThisMonth) ? dayInThisMonth : 0);

        if (startDayInWeek > endDayInWeek) {
            let condition = today > 15 ? dayInThisMonth : dayInLastMonth;
            result.push([], []);
            for (let i = startDayInWeek; i <= condition; i++) {
                result[0].push(i);
            }
            for (let j = 1; j <= endDayInWeek; j++) {
                result[1].push(j);
            }
        } else {
            for (let i = startDayInWeek; i <= endDayInWeek; i++) {
                result.push(i);
            }
        }
        return result;
    };
    methods.filterBirthInMonth = function(sourceArr, month) {
        return sourceArr.filter(function(element, index) {
            return element.birthDay[1] === month;
        }).sort(function(a, b) {
            return a.birthDay[0] - b.birthDay[0];
        });
    };
    methods.filterBirthInWeek = function(dayInWeekArr) {
        let lastDayOfMonth,
            curDay = time.curDay,
            curMonth = time.curMonth,
            curYear = time.curYear,
            filterBirthInLastMonth = this.filterBirthInMonth(birthdayList, (curMonth - 1 === 0) ? 12 : (curMonth - 1)),
            filterBirthInCurrentMonth = this.filterBirthInMonth(birthdayList, curMonth),
            filterBirthInNextMonth = this.filterBirthInMonth(birthdayList, (curMonth + 1 === 13) ? 1 : (curMonth + 1));

        if (Array.isArray(dayInWeekArr[0])) {//if we have ARRAY, it means we have a transform-week: a week have days in this month and another month
            let arr1, arr2;

            if (curDay > 15) {// we're in last days of the current month
                arr1 = filterBirthInCurrentMonth.filter(function(element, index) {
                    return dayInWeekArr[0].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
                arr2 = filterBirthInNextMonth.filter(function(element, index) {
                    return dayInWeekArr[1].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
            } else {// we're in first days of the current month
                arr1 = filterBirthInLastMonth.filter(function(element, index) {
                    return dayInWeekArr[0].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
                arr2 = filterBirthInCurrentMonth.filter(function(element, index) {
                    return dayInWeekArr[1].indexOf(element.birthDay[0]) !== -1;
                }).sort(function(a, b) {
                    return a.birthDay[0] - b.birthDay[0];
                });
            }
      
            return arr1.concat(arr2);    
        } else {// we're in the middle of the current month
            return filterBirthInCurrentMonth.filter(function(element, index) {
                return dayInWeekArr.indexOf(element.birthDay[0]) !== -1;
            }).sort(function(a, b) {
                return a.birthDay[0] - b.birthDay[0];
            });
        }
    };

    return {
        isStorageAvailable:         isStorageAvailable,
        getTime:                    time,
        getBirthList:               methods.getBirthList,
        listLength:                 methods.listLength,
        getRandomID:                methods.getRandomCode,
        addData:                    methods.addData,
        find:                       methods.find,
        editData:                   methods.editData,
        rmData:                     methods.rmData,
        rmAllData:                  methods.rmAllData,
        shouldBeSaved:              methods.shouldBeSaved,
        dontSaveDataAgain:          methods.dontSaveDataAgain,
        saveDataToLocalStorage:     methods.saveDataToLocalStorage,
        replaceData:                methods.replaceData,
        rangeOfWeek:                methods.rangeOfWeek,
        filterBirthInMonth:         methods.filterBirthInMonth,
        filterBirthInWeek:          methods.filterBirthInWeek
    };
}());

// get data from localStorage
if (BIRTH_STORE.isStorageAvailable) {
    const localStorageData = (typeof localStorage.birthdayList !== 'undefined') ? JSON.parse(localStorage.birthdayList) : [];// cause localStorage stores only STRING data.
    BIRTH_STORE.replaceData(localStorageData);
} else {
    alert('Trình duyệt hiện tại của bạn không hỗ trợ lưu trữ dữ liệu ngoại tuyến.\nChúng tôi sẽ không thể lưu lại dữ liệu bạn nhập hiện tại.');
}

document.addEventListener('DOMContentLoaded', function() {
    // get DOMs
    const overlay = document.getElementsByClassName('overlay')[0],
        birthBar = document.getElementsByClassName('form-container')[0],
        form = birthBar.children[0],
        rstrDataBtn = document.getElementById('rstrDataBtn'),
        inptFileBtn = document.getElementById('inptFileBtn'),
        bckpDataBtn = document.getElementById('bckpDataBtn'),
        navItem = document.getElementsByClassName('main-nav__item'),
        sortBtn = navItem[0],
        delAllBtn = navItem[1],
        backupBtn = navItem[2],
        addBirthBtn = navItem[3],
        plusIco = addBirthBtn.children[0],
        sortBtnGroup = document.getElementsByClassName('sort-sub-nav')[0],
        sortBtnList = sortBtnGroup.children,
        curWeekBtn = sortBtnList[0],
        curMnthBtn = sortBtnList[1],
        dispAllBtn = sortBtnList[2],
        backupBtnGroup = document.getElementsByClassName('backup-restore-sub-nav')[0],
        ul = document.getElementsByClassName('birth-list')[0],
        liList = ul.children;
    let checkedList = [],
        longPressedBefore = false;

    function METHOD_A() {// change UI
    // checkedList.length sẽ luôn tăng hoặc giảm theo từng nấc một (vì 1 lần click chỉ thay đổi trạng thái checked của 1 item)
        switch (checkedList.length) {
        case 0:// initial default UI
            delAllBtn.classList.remove('lighterTrash');
            plusIco.classList.add('fa-plus');
            plusIco.classList.remove('fa-pencil');
            break;
        case 1:// lighter TRASH icon, change ADD icon to EDIT icon
            delAllBtn.classList.add('lighterTrash');
            plusIco.classList.remove('fa-plus');
            plusIco.classList.add('fa-pencil');
            break;
        case 2:// change EDIT icon to ADD icon
            plusIco.classList.add('fa-plus');
            plusIco.classList.remove('fa-pencil');
            break;
        // case 3: tương tự case 2
        }
    }

    BIRTH_STORE.HANDLERS = {
        createDOMIn: function(thisDOM, propertyOfThisDOM, valueOfProperty, parentDOMOfThisDOM) {
            const newDOM = document.createElement(thisDOM);
            if (propertyOfThisDOM && valueOfProperty) {newDOM[propertyOfThisDOM] = valueOfProperty;}
            if (parentDOMOfThisDOM) {parentDOMOfThisDOM.appendChild(newDOM);}
            return newDOM;
        },
        addItem: function(personObj) {// create HTML elements - items
            let li, hiddenCheckbox, hiddenID, block1, block2, block3;

            li = BIRTH_STORE.HANDLERS.createDOMIn('li', null, null, ul);

            hiddenCheckbox = BIRTH_STORE.HANDLERS.createDOMIn('input', 'type', 'checkbox', li);
            hiddenCheckbox.id = personObj.ID;

            BIRTH_STORE.HANDLERS.createDOMIn('label', 'for', personObj.ID, li);

            hiddenID = BIRTH_STORE.HANDLERS.createDOMIn('span', 'textContent', personObj.ID, li);
            hiddenID.style.display = 'none';

            BIRTH_STORE.HANDLERS.createDOMIn('h3', 'textContent', personObj.name, li);
            BIRTH_STORE.HANDLERS.createDOMIn('p', 'textContent', personObj.note || '.', li);

            block1 = BIRTH_STORE.HANDLERS.createDOMIn('div', 'textContent', 'Day', li);
            block2 = BIRTH_STORE.HANDLERS.createDOMIn('div', 'textContent', 'Month', li);
            block3 = BIRTH_STORE.HANDLERS.createDOMIn('div', 'textContent', 'Year', li);
            block1.className = block2.className = block3.className = 'birthBlock';
            BIRTH_STORE.HANDLERS.createDOMIn('br', null, null, block1);
            BIRTH_STORE.HANDLERS.createDOMIn('br', null, null, block2);
            BIRTH_STORE.HANDLERS.createDOMIn('br', null, null, block3);
            BIRTH_STORE.HANDLERS.createDOMIn('span', 'textContent', personObj.birthDay[0], block1);
            BIRTH_STORE.HANDLERS.createDOMIn('span', 'textContent', personObj.birthDay[1], block2);
            BIRTH_STORE.HANDLERS.createDOMIn('span', 'textContent', personObj.birthDay[2], block3);
        },
        displayItems: function(sourceArr) {
            sourceArr.forEach(function(element, index) {
                BIRTH_STORE.HANDLERS.addItem(element);
            }, this);
        },
        rstrData: (function() {
            if ('FileReader' in window) {
                return function() {
                    if (BIRTH_STORE.HANDLERS.isEditing) {
                        alert('Hãy lưu lại item bạn đang chỉnh sửa.');
                    } else {
                        inptFileBtn.click();
                    }
                };
            } else {
                return function() {
                    alert('Rất tiếc, trình duyệt của bạn không hỗ trợ HTML5 FileReader. Vì vậy, chúng tôi không thể khôi phục dữ liệu của bạn.');
                };
            }
        }()),
        inptFile: function(e) {
            let fileToLoad = e.target.files[0];
            if (fileToLoad) {
                let reader = new FileReader();
                reader.addEventListener('load', function(fileLoadedEvent) {
                    let textFromFileLoaded = fileLoadedEvent.target.result,
                        dataParsedFromTextFile = JSON.parse(textFromFileLoaded);
                    BIRTH_STORE.replaceData(dataParsedFromTextFile);
                    BIRTH_STORE.saveDataToLocalStorage();
                });
                reader.readAsText(fileToLoad, 'UTF-8');
            }
            BIRTH_STORE.HANDLERS.refreshDisplay();
        },
        bckpData: function() {
            if ('Blob' in window) {
                function destroyClickedElement(e) {
                    document.body.removeChild(e.target);
                }
                let fileName = prompt('Hãy đặt tên tập tin dùng để sao lưu dữ liệu', 'birthdays_backupFile.txt');
                fileName = (fileName === '' ? 'birthdays_backupFile.txt' : fileName); 
                if (fileName) {
                    let textToWrite = JSON.stringify(BIRTH_STORE.getBirthList()).replace(/\n/g, '\r\n');
                    let textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
                    if ('msSaveOrOpenBlob' in navigator) {
                        navigator.msSaveOrOpenBlob(textFileAsBlob, fileName);
                    } else {
                        let downloadLink = document.createElement('a');
                        downloadLink.download = fileName;
                        downloadLink.innerHTML = 'Download File';
                        if ('webkitURL' in window) {
                        // Chrome allows the link to be clicked without actually adding it to the DOM.
                            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                        } else {
                        // Firefox requires the link to be added to the DOM before it can be clicked.
                            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                            downloadLink.addEventListener('click', destroyClickedElement);
                            downloadLink.style.display = 'none';
                            document.body.appendChild(downloadLink);
                        }
                        downloadLink.click();
                    }
                }
            } else {
                alert('Rất tiếc, trình duyệt của bạn không hỗ trợ HTML5 Blob. Chúng tôi không thể sao lưu dữ liệu của bạn thành 1 tập tin.');
            }
        },
        delAll: function() {
        // if data (BIRTH_STORE.getBirthList()) is empty already, no need to do anything
            if (!BIRTH_STORE.listLength) {
                alert('Không có dữ liệu để xoá');
                return;
            }
            if (confirm("Bạn có chắc chắn muốn xoá hết dữ liệu không?")) {
                ul.innerHTML = '';// display nothing
                BIRTH_STORE.rmAllData();// delete birthdayList

                checkedList = [];
                METHOD_A();
            }
        },
        dispCurWeek: function() {
            if (BIRTH_STORE.HANDLERS.isEditing) {
                alert('Hãy lưu lại item bạn đang chỉnh sửa.');
            } else {
                let birthInCurWeekList;
                ul.innerHTML = '';
                birthInCurWeekList = BIRTH_STORE.filterBirthInWeek(BIRTH_STORE.rangeOfWeek());
                BIRTH_STORE.HANDLERS.displayItems(birthInCurWeekList);
        
                ul.classList.add('birth-list--checkbox-hidden');
                checkedList = [];
                METHOD_A();

                if (!birthBar.classList.contains('form-container--hidden')) {
                    addBirthBtn.click();
                }
                BIRTH_STORE.HANDLERS.changeState(0);
            }
        },
        dispCurMonth: function() {
            if (BIRTH_STORE.HANDLERS.isEditing) {
                alert('Hãy lưu lại item bạn đang chỉnh sửa.');
            } else {
                let birthInCurMonthList;

                ul.innerHTML = '';
                birthInCurMonthList = BIRTH_STORE.filterBirthInMonth(BIRTH_STORE.getBirthList(), BIRTH_STORE.getTime.curMonth);
                BIRTH_STORE.HANDLERS.displayItems(birthInCurMonthList);
        
                ul.classList.add('birth-list--checkbox-hidden');
                checkedList = [];
                METHOD_A();

                if (!birthBar.classList.contains('form-container--hidden')) {
                    addBirthBtn.click();
                }
                BIRTH_STORE.HANDLERS.changeState(1);
            }
        },
        dispAll: function() {
            if (BIRTH_STORE.HANDLERS.isEditing) {
                alert('Hãy lưu lại item bạn đang chỉnh sửa.');
            } else {
                ul.innerHTML = '';
                BIRTH_STORE.HANDLERS.displayItems(BIRTH_STORE.getBirthList());
        
                ul.classList.add('birth-list--checkbox-hidden');
                checkedList = [];
                METHOD_A();

                if (!birthBar.classList.contains('form-container--hidden')) {
                    addBirthBtn.click();
                }
                BIRTH_STORE.HANDLERS.changeState(2);
            }
        },
        clsTab: function (e) {
            e = e || window.event;
            if (BIRTH_STORE.shouldBeSaved()) {
                console.log('Dữ liệu đã có sự thay đổi, đang lưu dữ liệu...');
                BIRTH_STORE.saveDataToLocalStorage();
                BIRTH_STORE.dontSaveDataToLocalStorageAgain();
            }
            if (e) {// For IE and Firefox prior to version 4
                e.returnValue = 'Sure?';
            }
            return 'Sure?';// For Safari
        },
        delCheckedItems: function() {
            if (checkedList.length !== 0 && confirm('Are you sure?')) {
                // things to do when in editing mode
                if (BIRTH_STORE.HANDLERS.isEditing) {
                    BIRTH_STORE.HANDLERS.isEditing = false;
                    form.reset();
                }

                // remove checked items
                checkedList.forEach(function(curId) {
                    BIRTH_STORE.HANDLERS.findDOM(curId).remove();
                });
            
                // remove in data
                BIRTH_STORE.find(checkedList, BIRTH_STORE.rmData);

                // change state of navbar
                checkedList = [];
                METHOD_A();

                if (!birthBar.classList.contains('form-container--hidden')) {
                    addBirthBtn.click();
                }
            }
        },
        rmItem: function(curLI) {
            checkedList.forEach(function(curId) {
                BIRTH_STORE.HANDLERS.findDOM(curId).remove();
            });
            curLI.remove();// it's an original DOM's method, not my self-defined method.
        },
        addOrEdit: function(e) {
            if (plusIco.classList.contains('fa-pencil')) {
                BIRTH_STORE.HANDLERS.editItem();
            } else {
                birthBar.classList.toggle('form-container--hidden');
                plusIco.classList.toggle('main-nav__item__ico--rotate');
                overlay.classList.toggle('overlay--hidden');

                if (!birthBar.classList.contains('form-container--hidden')) {
                    form.children[0].focus();
                }
            }
        },
        editItem: function() {
            if (BIRTH_STORE.HANDLERS.isEditing) {
                alert('Hãy lưu lại item bạn đang chỉnh sửa trước khi chỉnh sửa item khác.');
            } else {
                let curCheckedItem = BIRTH_STORE.HANDLERS.findDOM(checkedList[0]),
                    childrenList_of_curItem = curCheckedItem.children,
                    oldId = childrenList_of_curItem[2].textContent,
                    oldName = childrenList_of_curItem[3].textContent,
                    oldNote = childrenList_of_curItem[4].textContent,
                    oldBirthDay = childrenList_of_curItem[5].children[1].textContent,
                    oldBirthMonth = childrenList_of_curItem[6].children[1].textContent,
                    oldBirthYear = childrenList_of_curItem[7].children[1].textContent,
                    oldBirth = oldBirthDay + '/' + oldBirthMonth + '/' + oldBirthYear,
                    nameINPUT = form.children[0],
                    birthdayINPUT = form.children[1],
                    noteINPUT = form.children[2],
                    oldIdINPUT = form.children[3],
                    sbmtBTN = form.children[4];

                if (birthBar.classList.contains('form-container--hidden')) {// show the birthday bar
                    birthBar.classList.remove('form-container--hidden');
                    plusIco.classList.add('main-nav__item__ico--rotate');
                    overlay.classList.remove('overlay--hidden');
                }

                // get old data for input elements
                nameINPUT.value = oldName;
                birthdayINPUT.value = oldBirth;
                noteINPUT.value = oldNote;
                oldIdINPUT.value = oldId;

                sbmtBTN.textContent = 'Save';
                form.children[0].focus();

                BIRTH_STORE.HANDLERS.curItem = curCheckedItem;
                BIRTH_STORE.HANDLERS.isEditing = true;
            }
        },
        saveItem: function() {
            let childrenList_of_curItem = BIRTH_STORE.HANDLERS.curItem.children,
                editingID = childrenList_of_curItem[2].textContent,
                oldName = childrenList_of_curItem[3],
                oldNote = childrenList_of_curItem[4],
                oldBirthDay = childrenList_of_curItem[5].children[1],
                oldBirthMonth = childrenList_of_curItem[6].children[1],
                oldBirthYear = childrenList_of_curItem[7].children[1],
                newName = form.children[0].value,
                newBirthArr = form.children[1].value.split('/').map(function(element, index) {
                    return ~~element;// convert string to number
                }),
                newNote = form.children[2].value,
                saveBTN = form.children[3],
                curryingEditData = BIRTH_STORE.editData(newName, newBirthArr, newNote);

            // replace the old data by the new one
            BIRTH_STORE.find(editingID, curryingEditData);

            // change item
            oldName.textContent = newName;
            oldNote.textContent = newNote;
            oldBirthDay.textContent = newBirthArr[0];
            oldBirthMonth.textContent = newBirthArr[1];
            oldBirthYear.textContent = newBirthArr[2];

            // change form's UI
            saveBTN.textContent = 'Submit';
            form.reset();

            // hide birthdayBar
            birthBar.classList.add('form-container--hidden');
            plusIco.classList.remove('main-nav__item__ico--rotate');
            overlay.classList.add('overlay--hidden');

            BIRTH_STORE.HANDLERS.isEditing = false;
        },
        sbmtForm: function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }

            let nameINPUT = form.children[0],
                birthINPUT = form.children[1],
                noteINPUT = form.children[2],
                idINPUT = form.children[3],
                sbmtBtn = form.children[4];

            if (sbmtBtn.textContent === 'Submit') {
                idINPUT.value = BIRTH_STORE.getRandomID(4);
                if (nameINPUT.value === '') {
                    alert('Hãy nhập tên người bạn muốn lưu giữ ngày sinh nhật!');
                } else {//check empty input
                    // get "date" string from input, split it into 3 parts & store them in array,
                    // then convert all array's elements to numbers
                    let birthdayArr = birthINPUT.value.split('/').map(function(element, index) {
                        return ~~element;
                    }),
                        newPerson = {
                            ID: idINPUT.value,
                            name: nameINPUT.value,
                            birthDay: birthdayArr,
                            note: noteINPUT.value,
                        };
                    BIRTH_STORE.HANDLERS.addItem(newPerson);
                    BIRTH_STORE.addData(newPerson);

                    // clear the form after 
                    form.reset();
                    form.children[0].focus();

                    BIRTH_STORE.saveDataToLocalStorage();//ONLY saveDataToLocalStorage after adding person. Other actions which modify the data will turn BIRTH_STORE.isModified to true. Then data will be saved when close tab, not after modifying the data.
                }
            } else if (sbmtBtn.textContent === 'Save') {
                BIRTH_STORE.HANDLERS.saveItem();
            }
        },
        longPressOnItem: function(e) {
            let longPressedDOM = e.target,
                itemCheckbox = longPressedDOM.children[0],
                itemID = longPressedDOM.children[2];
            // kiểm tra checkedList.length !== 0 thì mới làm những việc sau:
            // - hiển thị checkbox cho tất cả item
            // - chưa có việc nào khác nữa
            if (checkedList.length === 0) {
                ul.classList.remove('birth-list--checkbox-hidden');
                if (longPressedDOM.tagName === 'LI') {
                    longPressedDOM.children[0].checked = true;
                    checkedList.push(itemID.textContent);
                }
                // METHOD_A();
            }
        },
        clckItem: function (e) {
            let clickedDOM = e.target,
                itemCheckbox = clickedDOM.children[0],
                itemID = clickedDOM.children[2];
            // nếu đang ở trạng thái bình thường (checkedList.length=0, checkbox không hiển thị) thì click event không làm gì
            if (!ul.classList.contains('birth-list--checkbox-hidden') && clickedDOM.tagName === 'LI') {
                itemCheckbox.click();
                if (itemCheckbox.checked) {
                    if (checkedList.indexOf(itemID.textContent) === -1) {
                        checkedList.push(itemID.textContent);
                    }
                } else {
                    if (checkedList.indexOf(itemID.textContent) > -1) {
                        let indexOfId = checkedList.indexOf(itemID.textContent);
                        checkedList.splice(indexOfId, 1);
                    }
                }
                METHOD_A();
            }
        },
        findDOM: function(IdStr) {// tìm DOM có chứa ID duy nhất đang được click
            let len = liList.length;
            for (let i = 0; i < len; i += 1) {
                if (IdStr === liList[i].children[2].textContent) {
                    return liList[i];
                }
            }
        },
        changeState: function(newStateIdx) {
            let oldStateIdx = BIRTH_STORE.HANDLERS.dispState;
            sortBtnList[oldStateIdx].classList.remove('sort-sub-nav__item--present-state');
            sortBtnList[newStateIdx].classList.add('sort-sub-nav__item--present-state');
            BIRTH_STORE.HANDLERS.dispState = newStateIdx;
        },
        refreshDisplay: function() {
            sortBtnList[BIRTH_STORE.HANDLERS.dispState].click();// TẠI SAO CLICK() KHÔNG CHẠY?????
        },
        idx: 0,
        curItem: null,
        isEditing: false,
        dispState: 0// thisWeek: 0, thisMonth: 1, displayAll: 2
    };


    // ==================================================================================== //
    // ================== DANGEROUS AREA: JS - THE EVENT-DRIVEN LANGUAGE ================== //
    // ==================================================================================== //
    // functional events: add new birthday, edit existing birthday in form
    form.addEventListener('submit', BIRTH_STORE.HANDLERS.sbmtForm.bind(BIRTH_STORE.HANDLERS), false);
    // functional-events: backup-restore
    rstrDataBtn.addEventListener('click', BIRTH_STORE.HANDLERS.rstrData, false);
    inptFileBtn.addEventListener('change', BIRTH_STORE.HANDLERS.inptFile, false);
    bckpDataBtn.addEventListener('click', BIRTH_STORE.HANDLERS.bckpData, false);
    // functional-events: save data when user want to close tab
    window.addEventListener('beforeunload', BIRTH_STORE.HANDLERS.clsTab, false);
    // functional-events: 
    addBirthBtn.addEventListener('click', BIRTH_STORE.HANDLERS.addOrEdit.bind(BIRTH_STORE.HANDLERS), false);

    // ul.addEventListener('change', METHOD_A, false);//seem not necessary, because 'click' event of ul element will invoke METHOD_A for us

    // UI/UX events: sort & display data
    curWeekBtn.addEventListener('click', BIRTH_STORE.HANDLERS.dispCurWeek.bind(BIRTH_STORE.HANDLERS), false);
    curMnthBtn.addEventListener('click', BIRTH_STORE.HANDLERS.dispCurMonth.bind(BIRTH_STORE.HANDLERS), false);
    dispAllBtn.addEventListener('click', BIRTH_STORE.HANDLERS.dispAll.bind(BIRTH_STORE.HANDLERS), false);
    // UI/UX events: play with checkbox when they are showed by the 'long-press' event added bellow
    ul.addEventListener('click', BIRTH_STORE.HANDLERS.clckItem.bind(BIRTH_STORE.HANDLERS), false);
    // UI/UX event: click on overlay to hide birthBar instead of re-click on add button
    overlay.addEventListener('click', function() {
        addBirthBtn.click();
    });
    // UI/UX events: show sub-nav
    sortBtn.addEventListener('click', function() {
        backupBtnGroup.classList.add('translatedDown100');
        sortBtnGroup.classList.toggle('translatedDown200');
    });
    backupBtn.addEventListener('click', function() {
        sortBtnGroup.classList.add('translatedDown200');
        backupBtnGroup.classList.toggle('translatedDown100');
    });
    // UI/UX events: click on TRASH button to delete checked items
    delAllBtn.addEventListener('click', BIRTH_STORE.HANDLERS.delCheckedItems, false);
    // UI/UX events: "long-press" on TRASH button & on items
    (function() {
        var timer1, timer2;
        function setTimer1(e) {
            timer1 = setTimeout(function() {
                BIRTH_STORE.HANDLERS.longPressOnItem(e);
            }, 1000);
        }
        function clearTimer1() {
            clearTimeout(timer1);
        }
        function setTimer2() {
            timer2 = setTimeout(BIRTH_STORE.HANDLERS.delAll, 1000);
        }
        function clearTimer2() {
            clearTimeout(timer2);
        }
        // UI/UX events: long-pressing on items list will show checkbox on each item
        ul.addEventListener('mousedown', setTimer1, false);
        ul.addEventListener('mouseup', clearTimer1, false);
        ul.addEventListener('touchstart', setTimer1, false);
        ul.addEventListener('touchend', clearTimer1, false);
        // UI/UX events: long-pressing on items list will delete all items
        delAllBtn.addEventListener('mousedown', setTimer2, false);
        delAllBtn.addEventListener('mouseup', clearTimer2, false);
        delAllBtn.addEventListener('touchstart', setTimer2, false);
        delAllBtn.addEventListener('touchend', clearTimer2, false);
    }());

    // initialize UI
    curWeekBtn.click();
});