//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) { // if the pointer to "user" object is not null, then someone is logged in
            console.log("User logged in")
        } else {
            console.log("No one logged in")
        }
    });
}
loadSkeleton();