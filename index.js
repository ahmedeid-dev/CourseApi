const http = require("http");
const fs = require("fs");
let courses = JSON.parse(fs.readFileSync('./courses.json'));
let departments = JSON.parse(fs.readFileSync('./departments.json'));
let students = JSON.parse(fs.readFileSync('./students.json'));

const server = http.createServer((req, res) => {
    const { url, method } = req;
    const sendResponse = (code, message) => {
        res.statusCode = code;
        return res.end(JSON.stringify(message));
    }
// ////////////////////////
    // get all student  |GET
    if (url == '/students' && method == "GET") {
        sendResponse(200, students)
        
        // Get all students with their department and courses related to the department
        
    } else if (url.startsWith("/allStudents") && method == "GET") {
        let allStudents = [];
        for (let index = 0; index < students.length; index++) {
                const element = students[index];
                const coId = students[index].courseId;
                const depId = students[index].departmentId;
                for (let i = 0; i < departments.length; i++) {
                    const dep = departments[i];
                    if (dep.id==element.departmentId) {
                        
                        element.department = dep;
                    }
                }
                for (let j = 0; j < courses.length; j++) {
                    const co = courses[j];
                    if (co.id == element.courseId) {
                        
                        element.course = co;
                    }
            }
            delete element.departmentId;
            delete element.courseId;
                allStudents.push(element)
        }
            sendResponse(200, allStudents);
            
            // add student       |POST

    } else if (url == '/students' && method == "POST") {
        req.on("data", (chunk) => {
            let student = JSON.parse(chunk);
            // console.log(student);
            student.id = students.length + 1;
            for (let index = 0; index < students.length; index++) {
                const element = students[index];
                if (element.email == student.email) {
            return sendResponse(409, { message: "Email Already Exist" })
                }
            }
            students.push(student)
            fs.writeFileSync("./students.json", JSON.stringify(students));
            sendResponse(201, { message: "Success" })
        })

        // update student   |PUT
    } else if (url.startsWith("/students/") && method == "PUT") {
        let urlId = Number(url.split('/')[2])
        let index = students.findIndex((student) => {
            return student.id == urlId
        })
        console.log(index);
        if (index == -1) {
            sendResponse(404, { message: "index not found" })
        }
        req.on("data", (chunk) => {
            let student = JSON.parse(chunk);
            students[index].name = student.name;
            fs.writeFileSync("./students.json", JSON.stringify(students));
            sendResponse(200, { message: "Updated" })
        })

        // delete student   |DELETE
    } else if (url.startsWith("/students/") && method == "DELETE") {
        let urlId = Number(url.split('/')[2])
        let index = students.findIndex((student) => {
            return student.id == urlId
        })
        if (index == -1) {
            sendResponse(404, { message: "index not found" })
            return false;
        }
        students.splice(index, 1);
        fs.writeFileSync("./students.json", JSON.stringify(students));
        sendResponse(200, { message: "Deleted" })
        
        // search for a student by ID
        
    } else if (url.startsWith("/students/") && method == "GET") {
        let urlId = Number(url.split('/')[2])
        let index = students.findIndex((student) => {
            return student.id == urlId
        })
        if (index == -1) {
            sendResponse(404, { message: "index not found" })
        }
        sendResponse(200, students[index])
    }

    /////////////////////////

    // get all departments  |GET
    else if (url == '/departments' && method == "GET") {
        sendResponse(200, departments)

        //  Get a specific department

    } else if (url.startsWith("/departments/") && method == "GET") {
            let urlId = Number(url.split('/')[2])
            let index = departments.findIndex((department) => {
                return department.id == urlId
            })
            if (index == -1) {
                sendResponse(404, { message: "index not found" })
            }
            sendResponse(200, departments[index])
        
    // add departments       |POST
    
    } else if (url == '/departments' && method == "POST") {
        req.on("data", (chunk) => {
            let department = JSON.parse(chunk);
            department.id = departments.length + 1;
            departments.push(department)
            fs.writeFileSync("./departments.json", JSON.stringify(departments));
            sendResponse(201, { message: "Success" })
        })

    //  update departments   |PUT
    } else if (url.startsWith("/departments/") && method == "PUT") { 
        let urlId = Number(url.split('/')[2])
        let index = departments.findIndex((department) => {
            return department.id == urlId
        })
        console.log(index);
        if (index == -1) {
            sendResponse(404, { message:"index not found"  })
        }
        req.on("data", (chunk) => {
            let department = JSON.parse(chunk);
            departments[index].name = department.name;
            fs.writeFileSync("./departments.json", JSON.stringify(departments));
            sendResponse(200, { message: "Updated"  })
        })

    
        // delete departments  |DELETE

    } else if (url.startsWith("/departments/") && method == "DELETE") { 
        let urlId = Number(url.split('/')[2])
        let index = departments.findIndex((department) => {
            return department.id == urlId
        })
        if (index == -1) {
            sendResponse(404, { message: "index not found" })
            return false;
        }
        departments.splice(index, 1);
        fs.writeFileSync("./departments.json", JSON.stringify(departments));
        sendResponse(200, { message: "Deleted"  })
    
    }

        /////////////////////////

    // get all courses  |GET
    else if (url == '/courses' && method == "GET") {
        sendResponse(200, courses)
        
        //  Get a specific course
        
} else if (url.startsWith("/courses/") && method == "GET") {
    let urlId = Number(url.split('/')[2])
    let index = courses.findIndex((course) => {
        // return course.id == urlId
        return course.id == urlId
    })
    if (index == -1) {
        sendResponse(404, { message: "index not found" })
    }
    sendResponse(200, courses[index])

    // add course       |POST
    } else if (url == '/courses' && method == "POST") {
        req.on("data", (chunk) => {
            let course = JSON.parse(chunk);
            course.id = courses.length + 1;
            courses.push(course)
            fs.writeFileSync("./courses.json", JSON.stringify(courses));
            sendResponse(201, { message: "Success" })
        })

    //  update course   |PUT
    } else if (url.startsWith("/courses/") && method == "PUT") { 
        let urlId = Number(url.split('/')[2])
        let index = courses.findIndex((course) => {
            return course.id == urlId
        })
        console.log(index);
        if (index == -1) {
            sendResponse(404, { message:"index not found"  })
        }
        req.on("data", (chunk) => {
            let course = JSON.parse(chunk);
            courses[index].name = course.name;
            fs.writeFileSync("./courses.json", JSON.stringify(courses));
            sendResponse(200, { message: "Updated"  })
        })

    // delete course   |DELETE
    } else if (url.startsWith("/courses/") && method == "DELETE") { 
        let urlId = Number(url.split('/')[2])
        let index = courses.findIndex((course) => {
            return course.id == urlId
        })
        if (index == -1) {
            sendResponse(404, { message: "index not found" })
            return false;
        }
        courses.splice(index, 1);
        fs.writeFileSync("./courses.json", JSON.stringify(courses));
        sendResponse(200, { message: "Deleted"  })
    } else {
        sendResponse(404, { message:"route not found"  })
    }
})

/////////////////////////

server.listen(3000, () => {
    console.log("server is runnung ...");
});