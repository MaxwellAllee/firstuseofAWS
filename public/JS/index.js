const socket = io();
const regex = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i
$(document).ready(function () {
    //initial load of existing factories
    $.post("/api/load", function (data) {
        factoryConstructor(data)
    });
    //socket.io allowing for synchronization
    socket.on('page update', function (newData) {
        factoryConstructor(newData)
    });
    //creates modal for factory creation from root
    $(".rootPop").click(function () {

        $('#modal').modal('toggle');
        $('.modalContent').html(` 
        <div class="modal-header text-white bg-secondary">
            <h5 class="modal-title" id="modalLabel">New Factory</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
        <form>
        <div class="form-group">
          <label>Factory Name</label>
          <div class="errorCheck injectionError"></div>
          <input type="text" class="form-control" id="factoryName"  value = "Factory">
          <label>Factory Quantity</label>
          <div class="errorCheck" id = "factoryQError"></div>
          <input type="number" class="form-control" id="factoryQ" value = 1 min="1" max="15">
          <label>Lower limit for Random Numbers</label>
          <div class="errorCheck" id = "factoryLError"></div>
          <input type="number" class="form-control" value =1 id="factoryL">
          <label>Upper limit for Random Numbers</label>
          <div class="errorCheck" id = "factoryUError"></div>
          <input type="number" class="form-control" value =100 id="factoryU">
        </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary " onclick="newFactory()" id="newSubmit">Submit</button>
        </div>`)


    })
})
// Takes values from root modal validates them and then send them to servers
function newFactory(params) {
    const newFact = {}
    let namePass = false
    newFact.name = $("#factoryName").val().trim()
    namePass = nameCheck(newFact.name)
    if (namePass) {
        $(".injectionError").html("")
        q = $("#factoryQ").val()
        l = $("#factoryL").val()
        u = $("#factoryU").val()
        let qualified = valueCheck(q, l, u)
        if (qualified === "success") {
            $('#modal').modal('toggle');
            newFact.id = params
            newFact.quantity = Number(q)
            newFact.lower = Number(l)
            newFact.upper = Number(u)
            $.post("/api/create",
                newFact
            ).then(function (result) {
                console.log(result)
            }
            )
        }
    }
}
//creates modal for renaming factory
function renameIt(id) {
    $('#modal').modal('toggle');
    $('.modalContent').html(` 
<div class="modal-header text-white bg-secondary">
    <h5 class="modal-title" id="modalLabel">Rename Factory</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="modal-body">
<form>
<div class="form-group">
  <label>Factory Name</label>
  <div class="errorCheck injectionError"></div>
  <input type="text" class="form-control" id="factoryName2"  value = "Factory">
</div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary " onclick="renameFactory(${id})" id="newSubmit">Save changes</button>
</div>`)
}
// generates the factories to the dom from data passed from database
function factoryConstructor(params) {
    let spacing = ""
    let line = ""
    $(".data").html(``)
    for (let i = 0; i < params.length; i++) {
        if (i === 0) {
            $(".data").html(`<div>│</div>`)

        }
        if (i !== (params.length - 1)) {
            line = "<span class ='buttonLine'>├──</span>"
            spacing = "<span class='lBar'>│</span>"
        }
        else {
            line = "└──"
            spacing = "<span class='bBar'></span>"
        }
        const thisFactory = params[i]
        $(".data").append(`${line} <span class="dropdown">

    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    ${thisFactory.name}
    </button>
    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a class="dropdown-item test" href="#" onclick="renameIt(${thisFactory.id})" >Rename Factory</a>
      <a class="dropdown-item params"  href="#" onclick="updateNumbers(${thisFactory.id})">Change Factory Paramaters</a>
      <a class="dropdown-item delete" onclick="deleted(${thisFactory.id})"  href="#">Delete Factory</a>
    </div>
  </span><ul class="row${thisFactory.id}">`)

        for (let j = 0; j < thisFactory.quantity; j++) {
            if (j !== (thisFactory.quantity - 1)) {
                $(`ul.row${thisFactory.id}`).append(`<li>${spacing}├──  ${thisFactory[j]}</li>`)
            }
            else {
                $(`ul.row${thisFactory.id}`).append(`<li>${spacing}└──  ${thisFactory[j]}</li>`)
            }
        }
        $(".data").append(`</ul>`)
    }
}
//Takes name from rename modal validates and then passes it to server
function renameFactory(passed) {
    const newName = $("#factoryName2").val().trim()
    let namePass = false
    namePass = nameCheck(newName)
    if (namePass) {

        $('#modal').modal('toggle');
        $.post("/api/rename", {
            name: newName,
            id: passed
        }
        ).then(function (result) {
            console.log(result)
        }
        )
    }
}
// Creates modal to allow user to change parameters for random number generated by factory
function updateNumbers(params) {
    $('#modal').modal('toggle');
    $('.modalContent').html(` 
<div class="modal-header text-white bg-secondary">
    <h5 class="modal-title" id="modalLabel">New Factory</h5>
    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
<div class="modal-body">
<form>
<div class="form-group">
  <label>Factory Quantity</label>
  <div class="errorCheck" id = "factoryQError"></div>
  <input type="number" class="form-control" id="factoryQ" value = 1 min="1" max="15">
  <label>Lower limit for Random Numbers</label>
  <div class="errorCheck" id = "factoryLError"></div>
  <input type="number" class="form-control" value =1 id="factoryL">
  <label>Upper limit for Random Numbers</label>
  <div class="errorCheck" id = "factoryUError"></div>
  <input type="number" class="form-control" value =100 id="factoryU">
</div>
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
    <button type="button" class="btn btn-primary " onclick="newNums(${params})" id="newSubmit">Save changes</button>
</div>`)
}
// Takes values created by user changing parameters of a factory valides values and send them to the server
function newNums(params) {
    const newFact = {}
    q = $("#factoryQ").val()
    l = $("#factoryL").val()
    u = $("#factoryU").val()
    let qualified = valueCheck(q, l, u)
    if (qualified === "success") {
        $('#modal').modal('toggle');
        newFact.id = params
        newFact.quantity = Number(q)
        newFact.lower = Number(l)
        newFact.upper = Number(u)
        $.post("/api/rowUpdate",
            newFact
        ).then(function (result) {
            console.log(result)
        }
        )
    }
}

//when delete factory is clicked api call is made to delete data from database 
function deleted(params) {
    $.post("/api/remove",
        { id: params }
    ).then(function (result) {
        console.log(result)
    }
    )
}
//checks the values of user inputs to make sure it will not cause errors and lets user know what corrections are needed
function valueCheck(q, l, u) {
    const nq = Number(q)
    const nl = Number(l)
    const nu = Number(u)
    $("#factoryQError").html("")
    $("#factoryUError").html("")
    $("#factoryLError").html("")
    if (q <= 15 && q >= 1) {
        if (nq % 1 === 0) {
            if (l !== "") {
                if (l.length < 12) {
                    if (u !== "") {
                        if (u.length < 11) {
                            if (nl < nu) {

                                return ("success")
                            }
                            else {
                                $("#factoryLError").html("The lower limit must be less than upper limit")
                            }
                        }
                        else{
                            $("#factoryUError").html("This number must have 10 or less digits")
                        }
                    }
                    else {
                        $("#factoryUError").html("The Upper limit must not be blank")
                    }
                }
                else {
                    $("#factoryLError").html("This number must have 10 or less digits")
                }
            }
            else {
                $("#factoryLError").html("The lower limit must not be blank")
            }
        }
        else {
            $("#factoryQError").html("The quantity must not have a remainder")
            return
        }
    }
    else {
        $("#factoryQError").html("The quantity must be between 1-15")
        return
    }

}
//checks that code is not trying to be injected into database
function nameCheck(name) {
    if (name.length > 20) {
        $(".injectionError").html("Name must be less then 20 characters")
    }
    else {
        if (regex.test(name)) {
            return (true)
        }
        else {
            $(".injectionError").html("You may only use letters and numbers in factory name and name cannot be blank.")
        }
    }
}