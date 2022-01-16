const print = console.log

const class_1 = document.getElementById("class-1")
const class_2 = document.getElementById("class-2")
const day_names = "MTuWThFS".split(/(?=[A-Z])/)

function sort(list, lambda=e=>e) {
    list.sort((a,b)=>lambda(a)-lambda(b))
    return list
}

function setClass(class_element, class_name, link, start_time, end_time) {
    class_element = class_element==1?class_1:class_2
    class_element.setAttribute("href", `https://meet.google.com/${link}`)
    class_element.getElementsByClassName("class-name")[0].innerHTML = class_name
    class_element.getElementsByClassName("meet-link")[0].innerHTML = `https://meet.google.com/${link}`
    let time_string = "", hours, minutes
    if(class_element == class_1) {
        hours = new Date().getHours() - start_time
        minutes = new Date().getMinutes()
        if(hours) time_string = `Started ${hours} hours, ${minutes} minutes ago`
        else time_string = `Started ${minutes} minutes ago`
    }
    else {
        hours = start_time - new Date().getHours() - 1
        minutes = 60 - new Date().getMinutes()
        if(minutes == 60) {
            hours -= 1
            minutes = 0
        }
        if(hours) {
            time_string = `Starting in ${hours} hours, ${minutes} minutes`
        }
        else {
            time_string = `Starting in ${minutes} minutes`
        }
    }
    class_element.getElementsByClassName("run-time")[0].innerHTML = time_string
}

function emptyClass(class_element) {
    class_element = class_element==1?class_1:class_2
    class_element.querySelector(".class-name").innerHTML = "^.^"
    class_element.querySelector(".meet-link").innerHTML = ""
    class_element.querySelector(".run-time").innerHTML = ""
}

function setup() {
    let current_day = day_names[new Date().getDay()-1]
    let current_time = new Date().getHours()
    let classes_today = []
    for(let [class_name, {link, time, id}] of Object.entries(schedule)) {
        let times = time.split(",")

        for(let date_and_time of times) {
            let days = [...date_and_time.matchAll(/[A-Z][a-z]?/g)].flat(999)
            if(days.indexOf(current_day) != -1) {
                date_and_time = date_and_time.match(/\d+/g)
                date_and_time = date_and_time.map(e => parseInt(e)).map(e=>e + (e<=7?12:0))
                classes_today.push([class_name, link, ...date_and_time])
            }
        }
    }

    classes_today = sort(classes_today, ele=>ele[2])

    for(let i = 0; i < classes_today.length; ++i) {
        let [class_name, link, start, end] = classes_today[i]
        if(current_time < start) {
            // Remove the current class
            emptyClass(1)
            // This is the next class, set it and break
            setClass(2, ...classes_today[i])
            break
        }
        if(current_time >= start && current_time < end) {
            // This is the current class
            setClass(1, ...classes_today[i])
            if(i == classes_today.length - 1)  {
                emptyClass(2)
                break
            }
            // Set next class
            setClass(2, ...classes_today[i+1])
            break
        }
    }
}

setup()
setInterval(() => {
    setup()
}, 1000);