var user = null;

function fillInfo() {
    var table = document.querySelector("tbody#userPersonalInfo");
    if (table != null) {
        var row = table.insertRow();
        user.then(el=>{
            row.insertCell().innerText = el.id;
            row.insertCell().innerText = el.firstName;
            row.insertCell().innerText = el.lastName;
            row.insertCell().innerText = el.age;
            row.insertCell().innerText = el.email;
            var rcell = row.insertCell();
            el.roles.map((x)=>{rcell.innerText += x.roleName + '\xa0'});
        })
    }
}

async function loadInfo() {
    user = (await fetch("/api/principal")).json();
    var roles = document.querySelector("#navRoles");
    roles.innerHTML = roles.innerHTML = '<span></span>';
    roles = roles.children[0];
    user.then(el => {
    document.querySelector("#navEmail").innerHTML = `<span>${el.email}</span>`;
    el.roles.forEach(el=>{
        roles.innerText += el.roleName + '\xa0';
    })
    fillInfo();
});
}