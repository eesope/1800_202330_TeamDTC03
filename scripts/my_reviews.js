let water_fountain_CardTemplate = document.getElementById("reviewCardTemplate");
let water_fountain_Group = document.getElementById("reviewCardGroup");

let params = new URL(window.location.href); // Get the URL from the search bar
let userID = params.searchParams.get("docID");

function populateReviews() {
    db.collection("reviews")
        .where("userID", "==", userID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var water_fountainName = doc.data().water_fountainName;
                var title = doc.data().title;
                var description = doc.data().description;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value

                let reviewCard = water_fountain_CardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".fountain-name").innerHTML = water_fountainName;
                reviewCard.querySelector(".title").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

                // Populate the star rating based on the rating value

                // Initialize an empty string to store the star rating HTML
                let starRating = "";
                // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                // After the first loop, this second loop runs from i=rating to i<5.
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                reviewCard.querySelector('#delete-icon').onclick = () => deleteReview(doc.id);
                water_fountain_Group.appendChild(reviewCard);
            });
        });
}

populateReviews();

function deleteReview(postid) {
    var result = confirm("Want to delete?");
    if (result) {
        //Logic to delete the item
        db.collection("reviews").doc(postid)
            .delete()
            .then(() => {
                console.log("1. Document deleted from Posts collection");
                deleteFromMyReviews(postid);
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
    }
}

function deleteFromMyReviews(postid) {
    firebase.auth().onAuthStateChanged(user => {
        db.collection("users").doc(user.uid).update({
            myposts: firebase.firestore.FieldValue.arrayRemove(postid)
        })
            .then(() => {
                console.log("2. post deleted from user doc");
                deleteFromStorage(postid);
            })
    })
}

function deleteFromStorage(postid) {
    var storage = firebase.storage();
    var storageRef = storage.ref();

    // Create a reference to the file to delete
    var imageRef = storageRef.child('images/' + postid + '.jpg');

    // Delete the file
    imageRef.delete().then(() => {
        // File deleted successfully
        console.log("3. image deleted from storage");
        alert("DELETE is completed!");
        location.reload();
    }).catch((error) => {
        //Error occurred!
    });
}