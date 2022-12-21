const roles = [];
var lastNavActive = null;
var curNavActive = document.querySelector("a#userTableBtn");
var newUserForm = null;

async function getRoles() {
    let temp = (await fetch("/api/roles")).json();
    temp.then(x=>x.map(x=>roles.push(x)));
}

getRoles();

function insertTable(el) {
    let table = document.querySelector('tbody#usersTableBody');
    var row = table.insertRow();
    row.insertCell().innerText = el.id;
    row.insertCell().innerText = el.firstName;
    row.insertCell().innerText = el.lastName;
    row.insertCell().innerText = el.age;
    row.insertCell().innerText = el.email;
    var rcell = row.insertCell();
    el.roles.map((x)=>{rcell.innerText += x.roleName + '\xa0'});
	row.insertCell().innerHTML = `<a type="button" class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#modalEditUser" data-bs-id="${el.id}" data-bs-fname="${el.firstName}" data-bs-lname="${el.lastName}" data-bs-age="${el.age}" data-bs-email="${el.email}">Edit</a>`;
	row.insertCell().innerHTML = `<a type="button" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#modalDeleteuser" data-bs-id="${el.id}" data-bs-fname="${el.firstName}" data-bs-lname="${el.lastName}" data-bs-age="${el.age}" data-bs-email="${el.email}">Delete</a>`;
}

const editModal = document.querySelector('#modalEditUser')
editModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
	
	editModal.querySelector('#id0').value = button.getAttribute('data-bs-id')
    editModal.querySelector('#fname0').value = button.getAttribute('data-bs-fname')
	editModal.querySelector('#lname0').value = button.getAttribute('data-bs-lname')
	editModal.querySelector('#age0').value = button.getAttribute('data-bs-age')
	editModal.querySelector('#email0').value = button.getAttribute('data-bs-email')

})

const deleteModal = document.querySelector('#modalDeleteuser')
deleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget

    deleteModal.querySelector('#id1').value = button.getAttribute('data-bs-id')
    deleteModal.querySelector('#fname1').value = button.getAttribute('data-bs-fname')
	deleteModal.querySelector('#lname1').value = button.getAttribute('data-bs-lname')
	deleteModal.querySelector('#age1').value = button.getAttribute('data-bs-age')
	deleteModal.querySelector('#email1').value = button.getAttribute('data-bs-email')

})

async function fillTable() {
	let json = (await fetch("/api/users")).json();
	let table = document.querySelector('tbody#usersTableBody');
	table.innerHTML = "";
	json.then((el)=>{el.map((el)=>insertTable(el))})
}

const delf = document.querySelector("form#userDeleteForm")
delf.addEventListener('submit', el => {
	el.preventDefault();
	let userId = document.querySelector("#id1");
	fetch("/api/users/" + userId.value, {method: "DELETE"}).then(()=>{fillTable()});
	deleteModal.querySelector('button.btn-close').click()
	delf.reset();
})

const editf = document.querySelector("form#userEditForm");

editf.addEventListener('submit', async (evt) =>{
    event.preventDefault();
    let fd = new FormData(editf);
    const object = {
        roles:[]
    };
    fd.forEach((value, key) => {
        if (key == "roles") {
            var role = {
                id: value,
                name: roles.find(x=>x.id==value).name
            };
            object.roles.push(role);
        } else {
            object[key] = value;
        }
    });
    console.log(object);
    await fetch("/api/users/" + object.id, {
        method: "PUT", 
        headers: {"Content-type": "application/json"}, 
        body: JSON.stringify(object)
    }).then(()=> fillTable());
    editModal.querySelector('button.btn-close').click();
    editf.reset();
});

const showUsersTable = function () {
    lastNavActive = curNavActive;
    curNavActive = document.querySelector("a#userTableBtn");
    lastNavActive.classList.remove("active");
    curNavActive.classList.add("active");
    document.querySelector("h4#cardHeader").innerText = 'All users';
    document.querySelector("#cardBody").innerHTML = "\
        <table class=\"table table-striped table-hover\" id=\"usersTable\">\
            <thead>\
                <tr>\
                    <th>ID</th>\
                    <th>First Name</th>\
                    <th>Last Name</th>\
                    <th>Age</th>\
                    <th>Email</th>\
                    <th>Role</th>\
                    <th>Edit</th>\
                    <th>Delete</th>\
                </tr>\
            </thead>\
            <tbody id=\"usersTableBody\">\
            </tbody>\
        </table>\
    ";
    fillTable();
}

const showNewUserForm = function () {
    lastNavActive = curNavActive;
    curNavActive = document.querySelector("a#newUserBtn");
    lastNavActive.classList.remove("active");
    curNavActive.classList.add("active");
    document.querySelector("h4#cardHeader").innerText = 'Add new user';
    document.querySelector("#cardBody").innerHTML = "\
        <div class=\"container\">\
            <div class=\"col-md bg-white\">\
                <form class=\"offset-md-4 col-md-3 mt-4 mb-4\" id=\"newUserForm\">\
                    <div class=\"modal-body\">\
                        <br>\
                        <label for=\"fname\"><b>First name</b></label>\
                        <input type=\"text\" class=\"form-control\" name=\"firstName\" id=\"fname\" required/>\
                        <br>\
                        <label for=\"lname\"><b>Last name</b></label>\
                        <input type=\"text\" class=\"form-control\" name=\"lastName\" id=\"lname\" required/>\
                        <br>\
                        <label for=\"age\"><b>Age</b></label>\
                        <input type=\"number\" class=\"form-control\" min=\"0\" max=\"127\" name=\"age\" id=\"age\" required/>\
                        <br>\
                        <label for=\"email\"><b>Email</b></label>\
                        <input type=\"email\" class=\"form-control\" name=\"email\" id=\"email\" required/>\
                        <br>\
                        <label for=\"password\"><b>Password</b></label>\
                        <input type=\"text\" class=\"form-control\" name=\"password\" id=\"password\" value=\"\" required/>\
                        <br>\
                        <label for=\"roles\"><b>Role</b></label>\
                        <select multiple class=\"form-control form-control-sm\" id=\"roles\" name=\"roles\" size=\"2\" required>\
                            <option value=\"1\">ADMIN</option>\
                            <option value=\"2\">USER</option>\
                        </select>\
                        <button type=\"submit\" class=\"btn btn-success mt-3\">Add new user</button>\
                    </div>\
                </form>\
            </div>\
        </div>\
    ";
    newUserForm = document.querySelector("form#newUserForm");
    newUserForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        let fd = new FormData(newUserForm);
        console.log(fd);
        let object = {
            roles:[]
        };
        fd.forEach((value, key) => {
            if (key == "roles") {
                var role = {
                    id: value,
                    name: roles.find(x=>x.id==value).name
                };
                object.roles.push(role);
            } else {
                object[key] = value;
            }
        });
        console.log(object);
        await fetch("/api/users/", {
            method: "POST", 
            headers: {"Content-type": "application/json"}, 
            body: JSON.stringify(object)
        }).then(()=> {
            newUserForm.reset();
            showUsersTable();
        });
    });
}

showUsersTable();