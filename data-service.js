var fs = require("fs");

var employees = [];
var departments = [];

// export function initialize(){
module.exports.initalize = function () {
    return new Promise(function (resolve, reject) {
        // utf8 - file encoding
        fs.readFile('./data/employees.json', 'utf8', (err, employeesData) => {
            if (err) reject('Unable to read file'); // throw stops further execution, i.e. if error, don't do rest of code
            // console.log(employeesData);
            employees = JSON.parse(employeesData); // parse JSON file and assign values to employees var
            // console.log(employees);

            // read departments once reading employees is finished
            resolve();
            return fs.readFile('./data/departments.json', 'utf8', (err, departmentsData) => {
                if (err) reject('Unable to read file');
                // console.log(departmentsData);
                departments = JSON.parse(departmentsData);
                // console.log(departments);
                resolve();
            });
        });
    })
}


module.exports.getAllEmployees = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No results returned")
        } else {
            resolve(employees);
        }
    })
}
//employee/update
module.exports.updateEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No results returned")
        } else {
        let index =  employees.findIndex(update => update.employeeNum == employeeData.employeeNum);
    
        if (index < 0){
        console.log('2nd if reject');
        reject('No results returned');
    } else {
        console.log('else');
        employees[index]= employeeData;
        resolve();
        
    }
        }
    })
}

//	/employees?manager=value
module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No results returned")
        } else {
        let filteredEmployee =  employees.filter(employee => employee.employeeNum == num);
    
        if (filteredEmployee.length === 0){
        console.log('2nd if reject');
        reject('No results returned');
    } else {
        console.log('else');
        resolve(filteredEmployee);
    }
        }
    })
}
// 	/employees?department=value 
module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No result returned");
        } else {
            resolve(employees.filter(employee => employee.department == department));
        }
    })
}
// 	/employees?status=value 
module.exports.getEmployeesByStatus = function (status) {
    console.log(status);
    return new Promise(function (resolve, reject) {
        console.log(employees.length);
        if (employees.length === 0) {
            console.log('if then reject');
            reject("No result returned");
        } else {
            console.log('else');
            let filteredEmployees = employees.filter(employee => employee.status == status);
            console.log(filteredEmployees);
            if (filteredEmployees.length === 0) {
                console.log('2nd if reject');
                reject('No results returned');
            } else {
                console.log('else');
                resolve(filteredEmployees);
            }
            // resolve(employees.filter(employee => employee.status == status))
        }
    })
}
// 	/employees?manager=value 
module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No result returned");
        } else {
            resolve(employees.filter(employee => employee.employeeManagerNum == manager))
        }
    })
}

module.exports.getAllDepartments = function () {
    return new Promise(function (resolve, reject) {
        if (departments.length === 0) {
            reject("No results returned");
        } else {
            resolve(departments);
        }
    })
}


module.exports.getManagers = function () {
    return new Promise(function (resolve, reject) {
        if (employees.length === 0) {
            reject("No result returned");
        } else {
            // return only those employees where isManager is true using Array.filter()
            resolve(employees.filter(employee => employee.isManager === true));
        }
    })
}

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        console.log(typeof employeeData.isManager);
        // typeof returns a string showing data type
        if (typeof employeeData.isManager === 'undefined') {
            employeeData.isManager === false;
        } else {
            employeeData.isManager === true;
        }


      
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    })
}