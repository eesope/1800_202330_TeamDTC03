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
                console.log(rating);

                console.log(time);

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

                water_fountain_Group.appendChild(reviewCard);
            });
        });
}

populateReviews();
