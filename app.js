// Selecting DOM elements
const newMemberAddBtn = document.querySelector('.addMemberBtn button'),
      darkBg = document.querySelector('.dark_bg'),
      popupForm = document.querySelector('.popup'),
      crossBtn = document.querySelector('.closeBtn'),
      submitBtn = document.querySelector('.submitBtn'),
      modalTitle = document.querySelector('.modalTitle'),
      imgInput = document.querySelector('.img'),
      uploadimg = document.querySelector("#uploadimg"),
      form = document.querySelector('#myForm'),
      userInfo = document.querySelector(".userInfo"),
      tabSize = document.getElementById("table_size"),
      filterData = document.getElementById("search"),
      showEntries = document.querySelector(".showEntries");

let originalData = JSON.parse(localStorage.getItem('userProfile')) || [];
let getData = [...originalData];

let isEdit = false, editId;
let currentIndex = 1, tableSize = 10;

showInfo();
updateShowEntries();

// Event listeners
newMemberAddBtn.addEventListener('click', openAddMemberModal);
crossBtn.addEventListener('click', closeModal);
uploadimg.addEventListener('change', handleImageUpload);
form.addEventListener('submit', handleSubmit);
tabSize.addEventListener('change', handleTableSizeChange);
filterData.addEventListener("input", handleSearchInput);

function openAddMemberModal() {
    isEdit = false;
    submitBtn.textContent = "Submit";
    modalTitle.textContent = "Fill the Form";
    imgInput.src = "./img/pic1.png"; // Default image
    darkBg.classList.add('active');
    popupForm.classList.add('active');
    form.reset();
}

function closeModal() {
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
}

function handleImageUpload() {
    const file = uploadimg.files[0];
    if (file && file.size < 1000000) { // 1MB limit
        const fileReader = new FileReader();
        fileReader.onload = (e) => imgInput.src = e.target.result;
        fileReader.readAsDataURL(file);
    } else {
        alert("This file is too large or not selected!");
    }
}

function handleSubmit(e) {
    e.preventDefault();
    console.log("Submit button clicked");

    // Validate all required fields
    const requiredFields = [
        "sDate", "location", "call", "company", "phone", 
        "email", "segment", "aperson", "designation", 
        "required", "address", "remark", "ainformation"
    ];

    for (let field of requiredFields) {
        if (!document.getElementById(field).value) {
            alert(`Please fill out the ${field} field.`);
            return;
        }
    }

    const information = {
        id: Date.now(),
        picture: imgInput.src || "./img/pic1.png",
        date: document.getElementById("sDate").value,
        companyName: document.getElementById("company").value,
        callType: document.getElementById("call").value,
        location: document.getElementById("location").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        customerSegment: document.getElementById("segment").value,
        authorisedPerson: document.getElementById("aperson").value,
        designation: document.getElementById("designation").value,
        required: document.getElementById("required").value,
        address: document.getElementById("address").value,
        remarks: document.getElementById("remark").value,
        additionalInfo: document.getElementById("ainformation").value
    };

    console.log("Information being submitted:", information);

    if (!isEdit) {
        originalData.unshift(information);
    } else {
        originalData[editId] = information;
    }

    localStorage.setItem('userProfile', JSON.stringify(originalData));
    resetModal();
    updateDataView();
}

function resetModal() {
    darkBg.classList.remove('active');
    popupForm.classList.remove('active');
    form.reset();
}

function updateDataView() {
    getData = [...originalData];
    showInfo();
    updateShowEntries();
}

function handleTableSizeChange() {
    tableSize = parseInt(tabSize.value);
    currentIndex = 1;
    showInfo();
    updateShowEntries();
}

function handleSearchInput() {
    const searchTerm = filterData.value.toLowerCase().trim();

    if (searchTerm) {
        getData = originalData.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(searchTerm)
            );
        });
    } else {
        getData = [...originalData];
    }

    currentIndex = 1;
    showInfo();
}

function showInfo() {
    userInfo.innerHTML = ""; // Clear previous entries
    const tab_start = (currentIndex - 1) * tableSize;
    const tab_end = Math.min(tab_start + tableSize, getData.length);
    
    if (getData.length > 0) {
        for (let i = tab_start; i < tab_end; i++) {
            const staff = getData[i];
            userInfo.innerHTML += createTableRow(staff, i);
        }
    } else {
        userInfo.innerHTML = `<tr><td class="empty" colspan="16" align="center">No data available in table</td></tr>`;
    }
}

function createTableRow(staff, index) {
    return `<tr>
                <td>${index + 1}</td>
                <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                <td>${staff.date}</td>
                <td>${staff.companyName}</td>
                <td>${staff.callType}</td>
                <td>${staff.location}</td>
                <td>${staff.phone}</td>
                <td>${staff.email}</td>
                <td>${staff.customerSegment}</td>
                <td>${staff.authorisedPerson}</td>
                <td>${staff.designation}</td>
                <td>${staff.required}</td>
                <td>${staff.address}</td>
                <td>${staff.remarks}</td>
                <td>${staff.additionalInfo}</td>
                <td>
                    <button onclick="editInfo(${index})"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button onclick="deleteInfo(${index})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`;
}

function editInfo(index) {
    const staff = getData[index];
    isEdit = true;
    editId = index;
    modalTitle.textContent = "Edit Entry";
    submitBtn.textContent = "Update";

    document.getElementById("sDate").value = staff.date;
    document.getElementById("company").value = staff.companyName;
    document.getElementById("call").value = staff.callType;
    document.getElementById("location").value = staff.location;
    document.getElementById("phone").value = staff.phone;
    document.getElementById("email").value = staff.email;
    document.getElementById("segment").value = staff.customerSegment;
    document.getElementById("aperson").value = staff.authorisedPerson;
    document.getElementById("designation").value = staff.designation;
    document.getElementById("required").value = staff.required;
    document.getElementById("address").value = staff.address;
    document.getElementById("remark").value = staff.remarks;
    document.getElementById("ainformation").value = staff.additionalInfo;

    imgInput.src = staff.picture;
    darkBg.classList.add('active');
    popupForm.classList.add('active');
}

function deleteInfo(index) {
    originalData.splice(index, 1);
    localStorage.setItem('userProfile', JSON.stringify(originalData));
    updateDataView();
}

function updateShowEntries() {
    showEntries.textContent = `Showing ${((currentIndex - 1) * tableSize) + 1} to ${Math.min(currentIndex * tableSize, originalData.length)} of ${originalData.length} entries`;
}
