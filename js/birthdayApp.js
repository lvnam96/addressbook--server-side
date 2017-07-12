//THIS PET PROJECT MIGHT NOT SUPPORT IE.

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
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
}

const BIRTHDAY_STORE = {//create data
  birthdayList: [],
  isModified: false,
  time: (function() {
    let newDateObj = new Date(),
        isLeap = function (year) {// tính năm nhuận
          if (year % 4 || (year % 100 === 0 && year % 400)) {return 0;}
          else {return 1;}
        },
        howManyDaysInMonth = function (month, year) {// tính ngày trong tháng
          return month === 2 ? (28 + isLeap(year)) : (31 - (month - 1) % 7 % 2);
        };

    // this is a local method of a local obj (newDateObj)
    newDateObj.myGetDay = function() {// getDay() method -> myGetDay(): bắt đầu với thứ 2, vẫn 0-based
      let day = this.getDay();//getDay() trả về thứ trong tuần, bắt đầu từ chủ nhật, 0-based
      return day === 0 ? 6 : day - 1;
    };
    
    return {
      curDay: newDateObj.getDate(),
      curDate: newDateObj.myGetDay(), 
      curMonth: newDateObj.getMonth() + 1,
      curYear: newDateObj.getFullYear(),
      daysInMonth: howManyDaysInMonth
    };
  }()),
  addData: function(newPersonObj) {
    this.birthdayList.push(newPersonObj);
    this.isModified = true;
  },
  find: function(nameStr, callbackFunc, callbackObj) {
    let len = BIRTHDAY_STORE.birthdayList.length;
    for (let i = 0; i < len; i++) {
      if (this.birthdayList[i].name === nameStr) {
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
    return -1;
  },
  editData: function(idx, newNameStr, newBirthdayArr, newNoteStr) {
    this.birthdayList[idx].name = newNameStr;
    this.birthdayList[idx].birthDay = newBirthdayArr;
    this.birthdayList[idx].note = newNoteStr;
    this.isModified = true;
  },
  rmData: function(idx) {
    this.isModified = true;
    this.birthdayList.splice(idx, 1);
  },
  rmAllData: function() {
    this.birthdayList = [];
    this.isModified = true;
  },
  saveData: function() {
    localStorage.birthdayList = JSON.stringify(BIRTHDAY_STORE.birthdayList);
  },
  getData: function() {
    return (localStorage.birthdayList) ? JSON.parse(localStorage.birthdayList) : [];
  },
  rangeOfWeek: function(testDay, testDateNum) {//Calculate range (array) of days in current week
    let result = [],
        today = testDay || this.time.curDay,//ngày trong tháng, 1-based
        toDate = testDateNum > -1 ? testDateNum : this.time.curDate,
        thisMonth = this.time.curMonth,
        thisYear = this.time.curYear,
        daysInMonth = this.time.daysInMonth,
        dayInLastMonth = (thisMonth - 1) === 0 ? daysInMonth(12, thisYear - 1) : daysInMonth(thisMonth - 1, thisYear),
        dayInThisMonth = daysInMonth(thisMonth, thisYear),
        dayInNextMonth = (thisMonth + 1) === 13 ? daysInMonth(1, thisYear + 1) : daysInMonth(thisMonth + 1, thisYear),
        startDayInWeek = today - toDate + ((today - toDate < 1) ? dayInLastMonth : 0),
        endDayInWeek = today + 7 - toDate - 1 - ((today + 7 - toDate - 1 > dayInThisMonth) ? dayInThisMonth : 0);
    // console.log(today);console.log(toDate);console.log(dayInLastMonth);console.log(startDayInWeek);console.log(endDayInWeek);debugger;
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
  },
  filterBirthInMonth: function(sourceArr, month) {
    return sourceArr.filter(function(element, index) {
             return element.birthDay[1] === month;
           }).sort(function(a, b) {
             return a.birthDay[0] - b.birthDay[0];
           });
  },
  filterBirthInWeek: function(dayInWeekArr) {
    let result = [],
        lastDayOfMonth,
        curDay = this.time.curDay,
        curMonth = this.time.curMonth,
        curYear = this.time.curYear,
        filterBirthInLastMonth = this.filterBirthInMonth(this.birthdayList, (curMonth - 1 === 0) ? 12 : (curMonth - 1)),
        filterBirthInCurrentMonth = this.filterBirthInMonth(this.birthdayList, curMonth),
        filterBirthInNextMonth = this.filterBirthInMonth(this.birthdayList, (curMonth + 1 === 13) ? 1 : (curMonth + 1));

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
      }

      else {// we're in first days of the current month
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
    }

    else {// we're in the middle of the current month
      return filterBirthInCurrentMonth.filter(function(element, index) {
               return dayInWeekArr.indexOf(element.birthDay[0]) !== -1;
             }).sort(function(a, b) {
               return a.birthDay[0] - b.birthDay[0];
             });
    }
  }
};

//----------TESING NEW FUNCTION AREA-----------------------//



//----------TESING NEW FUNCTION AREA-----------------------//

document.addEventListener('DOMContentLoaded', function() {
  // get DOMs
  const form = document.getElementById('registrar'),
        sortBtnGroup = document.getElementsByClassName('sortBtnGroup')[0].children,
        curWeekBtn = sortBtnGroup[0],
        curMnthBtn = sortBtnGroup[1],
        dispAllBtn = sortBtnGroup[2],
        delAllBtn = document.getElementById('delAllBtn'),
        rstrDataBtn = document.getElementById('rstrDataBtn'),
        inptFileBtn = document.getElementById('inptFileBtn'),
        bckpDataBtn = document.getElementById('bckpDataBtn'),
        birthBar = document.getElementsByClassName('birthBar')[0],
        addBirthBtn = document.getElementById('addBirthBtn'),
        navIcon = addBirthBtn.children[0],
        ul = document.getElementById('invitedLst'),
        liList = ul.children;

  function destroyClickedElement(e) {
    document.body.removeChild(e.target);
  }

  // get data from localStorage
  if (storageAvailable('localStorage')) {
    BIRTHDAY_STORE.birthdayList = BIRTHDAY_STORE.getData();
  } else {
    alert('Trình duyệt hiện tại của bạn không hỗ trợ lưu trữ dữ liệu ngoại tuyến.\nChúng tôi sẽ không thể lưu lại dữ liệu bạn nhập hiện tại.');
  }

  BIRTHDAY_STORE.HANDLERS = {
    createDOMIn: function(thisDOM, propertyOfThisDOM, valueOfProperty, parentDOMOfThisDOM) {
      const newDOM = document.createElement(thisDOM);
      if (propertyOfThisDOM && valueOfProperty) {newDOM[propertyOfThisDOM] = valueOfProperty;}
      if (parentDOMOfThisDOM) {parentDOMOfThisDOM.appendChild(newDOM);}
      return newDOM;
    },
    addItem: function(personObj) {
      // <li>
      //   <h3>David</h3>
      //   <p>This is a note</p>
      //   <div class="birthdayBlock">
      //     Ngày<br/><span>10</span>
      //   </div>
      //   <div class="birthdayBlock">
      //     Tháng<br/><span>9</span>
      //   </div>
      //   <div class="birthdayBlock">
      //     Năm<br/><span>2014</span>
      //   </div>
      //   <hr/>
      //   <button>Edit</button>
      //   <button>Remove</button>
      // </li>
      const li = this.createDOMIn('li', null, null, ul);
      this.createDOMIn('h3', 'textContent', personObj.name, li);
      this.createDOMIn('p', 'textContent', personObj.note || '.', li);

      const block1 = this.createDOMIn('div', 'textContent', 'Day', li),
            block2 = this.createDOMIn('div', 'textContent', 'Month', li),
            block3 = this.createDOMIn('div', 'textContent', 'Year', li);
      block1.className = 'birthBlock';
      block2.className = 'birthBlock';
      block3.className = 'birthBlock';
      this.createDOMIn('br', null, null, block1);
      this.createDOMIn('br', null, null, block2);
      this.createDOMIn('br', null, null, block3);
      this.createDOMIn('span', 'textContent', personObj.birthDay[0], block1);
      this.createDOMIn('span', 'textContent', personObj.birthDay[1], block2);
      this.createDOMIn('span', 'textContent', personObj.birthDay[2], block3);
      // const editBTN = this.createDOMIn('button', 'innerHTML', '<i class="fa fa-pencil" aria-hidden="true"></i>', btnGroupDIV);
      // editBTN.className = 'editBtn';
      // const rmBTN = this.createDOMIn('button', 'innerHTML', '<i class="fa fa-times" aria-hidden="true"></i>', btnGroupDIV);
      // rmBTN.className = 'rmBtn';
      // li.appendChild(btnGroupDIV);
    },
    display: function(sourceArr) {
      sourceArr.forEach(function(element, index) {
        this.addItem(element);
      }, this);
    },
    rstrData: (function() {
      if ('FileReader' in window) {
        return function() {inptFileBtn.click();};
      } else {
        return function() {alert('Rất tiếc, trình duyệt của bạn không hỗ trợ HTML5 FileReader. Vì vậy, chúng tôi không thể khôi phục dữ liệu của bạn.');};
      }
    }()),
    inptFile: function(e) {
      let fileToLoad = e.target.files[0];
      if (fileToLoad) {
        let reader = new FileReader();
        reader.addEventListener('load', function(fileLoadedEvent) {
          let textFromFileLoaded = fileLoadedEvent.target.result;
          BIRTHDAY_STORE.birthdayList = JSON.parse(textFromFileLoaded);
          BIRTHDAY_STORE.isModified = true;
        });
        reader.readAsText(fileToLoad, 'UTF-8');
      }
    },
    bckpData: function() {
      if ('Blob' in window) {
        let fileName = prompt('Hãy đặt tên tập tin dùng để sao lưu dữ liệu', 'birthdays_backupFile.txt');
        if (fileName) {
          let textToWrite = JSON.stringify(BIRTHDAY_STORE.birthdayList).replace(/\n/g, '\r\n');
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
    sbmtForm: function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
      }
      let nameINPUT = form.children[0],
          birthINPUT = form.children[1],
          noteINPUT = form.children[2],
          sbmtBtn = form.children[3];
      if (sbmtBtn.textContent === 'Submit') {
        if (nameINPUT.value !== '') {//check empty input
          // get "date" string from input, split it into 3 parts & store them in array,
          // then convert all array's elements to numbers
          let birthdayArr = birthINPUT.value.split('/').map(function(element, index) {
                return ~~element;
              }),
              newPerson = {
                name: nameINPUT.value,
                birthDay: birthdayArr,
                note: noteINPUT.value,
                isRemembered: false
              };
          BIRTHDAY_STORE.HANDLERS.addItem(newPerson);
          BIRTHDAY_STORE.addData(newPerson);
          form.reset();
          form.children[0].focus();
          BIRTHDAY_STORE.saveData();//ONLY saveData after adding person. Other actions which modify the data will turn BIRTHDAY_STORE.isModified to true. Then data will be saved when close tab, not after modifying the data.
        } else {
          alert('Hãy nhập tên người bạn muốn lưu giữ ngày sinh nhật!');
        }
      } else if (sbmtBtn.textContent === 'Save') {
        let newName = nameINPUT.value,
            newBirth = birthINPUT.value.split('/').map(function(element, index) {
              return ~~element;
            }),
            newNote = noteINPUT.value;

        BIRTHDAY_STORE.editData(this.idx, newName, newBirth, newNote);
        if (!birthBar.classList.contains('hiddingBar')) {
          addBirthBtn.click();
        }
        this.saveItem(this.curLI);
        form.reset();
        this.isEditing = false;
      }
    },
    delAll: function() {
      // if data (BIRTHDAY_STORE.birthdayList) is empty already, no need to do anything
      if (BIRTHDAY_STORE.birthdayList[0] && confirm("Bạn có chắc chắn muốn xoá hết dữ liệu không?")) {
        ul.innerHTML = '';
        BIRTHDAY_STORE.rmAllData();
      }
    },
    dispCurWeek: function() {
      if (this.isEditing) {
        alert('Hãy lưu lại item bạn đang chỉnh sửa.');
      } else {
        if (this.dispState !== 0) {
          let birthInCurWeekList = BIRTHDAY_STORE.filterBirthInWeek(BIRTHDAY_STORE.rangeOfWeek());
          ul.innerHTML = '';
          BIRTHDAY_STORE.HANDLERS.display(birthInCurWeekList);
          
          if (!birthBar.classList.contains('hiddingBar')) {
            addBirthBtn.click();
          }
          this.changeState(0);
        }
      }
    },
    dispCurMonth: function() {
      if (this.isEditing) {
        alert('Hãy lưu lại item bạn đang chỉnh sửa.');
      } else {
        if (this.dispState !== 1) {
          let birthInCurMonthList = BIRTHDAY_STORE.filterBirthInMonth(BIRTHDAY_STORE.birthdayList, BIRTHDAY_STORE.time.curMonth);
          ul.innerHTML = '';
          BIRTHDAY_STORE.HANDLERS.display(birthInCurMonthList);
          
          if (!birthBar.classList.contains('hiddingBar')) {
            addBirthBtn.click();
          }
          this.changeState(1);
        }
      }
    },
    dispAll: function() {
      if (this.isEditing) {
        alert('Hãy lưu lại item bạn đang chỉnh sửa.');
      } else {
        if (this.dispState !== 2) {
          ul.innerHTML = '';
          BIRTHDAY_STORE.HANDLERS.display(BIRTHDAY_STORE.birthdayList);
          
          if (!birthBar.classList.contains('hiddingBar')) {
            addBirthBtn.click();
          }
          this.changeState(2);
        }
      }
    },
    clsTab: function (e) {
      e = e || window.event;
      if (BIRTHDAY_STORE.isModified) {
        console.log('Dữ liệu đã có sự thay đổi, đang lưu dữ liệu...');
        BIRTHDAY_STORE.saveData();
      }
      if (e) {// For IE and Firefox prior to version 4
          e.returnValue = 'Sure?';
      }
      return 'Sure?';// For Safari
    },
    rmItem: function(curLI) {
      curLI.remove();
    },
    editItem: function(curLI) {
      let oldNameSPAN = curLI.children[0],
          oldBirthP = curLI.children[1],
          oldNoteP = curLI.children[2],
          oldEditBTN = curLI.children[3],
          nameINPUT = form.children[0],
          birthdayINPUT = form.children[1],
          noteINPUT = form.children[2],
          sbmtBTN = form.children[3];

      // get old data for input elements
      nameINPUT.value = oldNameSPAN.textContent;
      birthdayINPUT.value = oldBirthP.textContent;
      noteINPUT.value = oldNoteP.textContent;

      sbmtBTN.textContent = 'Save';
    },
    saveItem: function(curLI) {
      let oldNameSPAN = curLI.children[0],
          oldBirthP = curLI.children[1],
          oldNoteP = curLI.children[2],
          nameINPUT = form.children[0],
          birthdayINPUT = form.children[1],
          noteINPUT = form.children[2],
          saveBTN = form.children[3];

      // replace the old data with the new one
      oldNameSPAN.textContent = nameINPUT.value;
      oldBirthP.textContent = birthdayINPUT.value;
      oldNoteP.textContent = noteINPUT.value;

      saveBTN.textContent = 'Submit';
    },
    clckItemBtn: function(e) {
      let clickedBTN = e.target,
          curLI = clickedBTN.parentNode.parentNode,
          nameElement = curLI.children[0];//before editBTN is clicked, it's nameSPAN, after that, it will be nameINPUT. After saveBTN is clicked, it will be back nameSPAN.
      if (clickedBTN.tagName === 'BUTTON') {
        if (clickedBTN.className === 'rmBtn') {
          if (this.isEditing) {
            alert('Hãy lưu lại item bạn đang chỉnh sửa trước khi xoá item khác.');
          } else {
            if (confirm('Bạn chắc chắn muốn xoá chứ?')) {
              this.rmItem(curLI);
              BIRTHDAY_STORE.find(nameElement.textContent, BIRTHDAY_STORE.rmData, APP);
            }
          }
        } else if (clickedBTN.className === 'editBtn') {
          if (this.isEditing) {
            alert('Hãy lưu lại item bạn đang chỉnh sửa trước khi chỉnh sửa item khác.');
          } else {
            let curName = nameElement.textContent;
            this.idx = BIRTHDAY_STORE.find(curName);
            this.curLI = curLI;

            if (birthBar.classList.contains('hiddingBar')) {addBirthBtn.click();}// show the birthday bar
            this.editItem(curLI);
            form.children[0].focus();
            this.isEditing = true;
          }
        }
      }
    },
    changeState: function(newStateIdx) {
      let oldStateIdx = this.dispState || 0;
      sortBtnGroup[oldStateIdx].classList.remove('presentState');
      sortBtnGroup[newStateIdx].classList.add('presentState');
      this.dispState = newStateIdx;
    },
    checkState: function() {//chưa biết dùng làm gì =)))))
      switch (this.dispState) {
      case 'thisWeek':
        this.dispCurWeek();
        break;
      case 'thisMonth':
        this.dispCurMonth();
        break;
      default:
        this.dispAll();
      }
    },
    idx: 0,
    curLI: null,
    isEditing: false,
    dispState: null// thisWeek: 0, thisMonth: 1, all: 2
  };

  form.addEventListener('submit', BIRTHDAY_STORE.HANDLERS.sbmtForm.bind(BIRTHDAY_STORE.HANDLERS), false);
  curWeekBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.dispCurWeek.bind(BIRTHDAY_STORE.HANDLERS), false);
  curMnthBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.dispCurMonth.bind(BIRTHDAY_STORE.HANDLERS), false);
  dispAllBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.dispAll.bind(BIRTHDAY_STORE.HANDLERS), false);
  delAllBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.delAll, false);
  rstrDataBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.rstrData, false);
  inptFileBtn.addEventListener('change', BIRTHDAY_STORE.HANDLERS.inptFile, false);
  bckpDataBtn.addEventListener('click', BIRTHDAY_STORE.HANDLERS.bckpData, false);
  ul.addEventListener('click', BIRTHDAY_STORE.HANDLERS.clckItemBtn.bind(BIRTHDAY_STORE.HANDLERS), false);
  window.addEventListener('beforeunload', BIRTHDAY_STORE.HANDLERS.clsTab, false);// save data when user want to close tab
  addBirthBtn.addEventListener('click', function() {
    document.getElementsByClassName('birthBar')[0].classList.toggle('hiddingBar');
    navIcon.classList.toggle('open');
  }, false);

  // initialize UI
  curWeekBtn.click();
});
