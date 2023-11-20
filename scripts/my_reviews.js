function displayReviewInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    // console.log("params is =", params);
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .doc(ID)
        .get()
        .then(doc => {
            thisReview = doc.data();
            reviewCode = thisReview.code;
            reviewName = doc.data().title;

            // only populate title, and image
            document.getElementById("reviewName").innerHTML = reviewName;
            // let imgEvent = document.querySelector(".review-img");
            // imgEvent.src = "../images/" + reviewCode + ".jpg";
        });
}
displayReviewInfo();

function saveReviewDocumentIDAndRedirect() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    localStorage.setItem('reviewID', ID);
    window.location.href = "my_reviews.html";

    
}



function populateReviews() {
    let reviewCardTemplate = document.getElementById("myReviewTemplate");
    let reviewCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href);
    let reviewID = params.searchParams.get("docID");

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            db.collection("reviews")
                .where("reviewDocID", "==", reviewID)
                .where("userID", "==", user.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var title = doc.data().title;
                        var description = doc.data().description;
                        var time = doc.data().timestamp.toDate();

                        let reviewCard = reviewCardTemplate.content.cloneNode(true);
                        reviewCard.querySelector(".title").innerHTML = title;
                        reviewCard.querySelector(".time").innerHTML = new Date(
                            time
                        ).toLocaleString();
                        reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

                        reviewCardGroup.appendChild(reviewCard);
                    });
                })
                .catch((error) => {
                    console.log("Error getting reviews: ", error);
                });
        } else {
            console.log("No user is signed in");
            // Handle when no user is signed in
        }
    });
}

// Call the function to populate the user's reviews
populateReviews();
