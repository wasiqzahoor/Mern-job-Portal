// check_middleware.js
console.log("Attempting to load authorizeRoles...");
try {
    const authorizeRoles = require('./middlewares/roleMiddleware'); // Make sure this path is CORRECT
    console.log('Value of authorizeRoles after require:', authorizeRoles);
    console.log('Type of authorizeRoles after require:', typeof authorizeRoles);

    if (typeof authorizeRoles === 'function') {
        const resultOfCallingAuthorize = authorizeRoles('admin');
        console.log('Value after calling authorizeRoles("admin"):', resultOfCallingAuthorize);
        console.log('Type after calling authorizeRoles("admin"):', typeof resultOfCallingAuthorize);

        if (typeof resultOfCallingAuthorize === 'function') {
            console.log("SUCCESS: authorizeRoles is correctly loaded and returns a function.");
        } else {
            console.error("ERROR: authorizeRoles is a function, but calling it does NOT return a function.");
        }
    } else {
        console.error("ERROR: authorizeRoles is NOT a function after require. It's likely undefined or something else.");
    }
} catch (error) {
    console.error("ERROR during require:", error.message);
    console.error("Full error stack:", error.stack);
}