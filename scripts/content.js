db.collection('reviews').get().then((snapshot) => {
    let first = true;
    snapshot.forEach((doc) => {
        if (first) {
            console.log(doc.data());
            var template = `<div class="water_fountains pb-2">
                <div class="container-fluid mb-3 pb-3">
                    <div class="title bg-white mb-3">${doc.data().title}</div>
                    <div class="card-body bg-white">
                        <p class="description">${doc.data().description}</p>
                    </div>
                    <span class="date">${new Date(doc.data().date.toDate()).toLocaleDateString()} ${new Date(doc.data().date.toDate()).toLocaleTimeString()}</span>
                </div>
            </div>`;
            $('.reviewing').append(template);
            first = false;
        }
    })

})

function displayWaterInfo() {
    let params = new URL(window.location.href); //get url of search bar
    let ID = params.searchParams.get("docID"); //get value for key "docID"
    console.log(ID)
}

function saveWaterFountainDocumentIDAndRedirect() {
    let params = new URL(window.location.href); //get url of search bar
    let ID = params.searchParams.get("docID"); //get value for key "docID"
    console.log(ID)

    localStorage.setItem('water_fountainID', ID)
    window.location.href = "writing_reviews.html"
}

function populateReviews() {
    let water_fountain_CardTemplate = document.getElementById("reviewCardTemplate");
    let water_fountain_Group = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let water_fountainID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .where("water_fountain_DocID", "==", water_fountainID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating);

                console.log(time);

                let reviewCard = water_fountain_CardTemplate.content.cloneNode(true);
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