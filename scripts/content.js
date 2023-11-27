db.collection('reviews').get().then((snapshot) => {
    let first = true;
    snapshot.forEach((doc) => {
        if (first) {
            var template = `<div class="water_fountains pb-2">
                <div class="container-fluid mb-3 pb-3">
                    <div class="title bg-white mb-3">${doc.data().name}</div>
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

    db.collection("vancouver_drinking_fountains")
    .doc(ID)
    .get()
    .then(doc => {
        thisWater = doc.data()
        waterCode = thisWater.code;
        waterName = doc.data().name;
        document.getElementById("waterName").innerHTML = waterName;
    }

    );
}

displayWaterInfo();

function saveWaterFountainDocumentIDAndRedirect() {
    let params = new URL(window.location.href); //get url of search bar
    let ID = params.searchParams.get("docID"); //get value for key "docID"

    localStorage.setItem('water_fountainID', ID)
    window.location.href = "writing_reviews.html"
}

function populateReviews() {
    let water_fountain_CardTemplate = document.getElementById("reviewCardTemplate");
    let water_fountain_Group = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let water_fountainID = params.searchParams.get("docID");

    db.collection("reviews")
        .where("water_fountain_DocID", "==", water_fountainID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                var photoUrl = doc.data().image;
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

                if (photoUrl) {
                    let imgElement = reviewCard.querySelector("img"); // Your template needs to have an img tag
                    imgElement.src = photoUrl;
                    imgElement.alt = "User uploaded image"; // Set an appropriate alt text
                }

                water_fountain_Group.appendChild(reviewCard);
            });
        })
        .catch((error) => {
            console.error("Error populating reviews:", error);
        });
}

populateReviews();

function displayImage() {
    // Extract docID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const docID = urlParams.get('docID');

    if (!docID) {
        console.log("Document ID is not provided in the URL");
        return;
    }

    const docRef = db.collection('vancouver_drinking_fountains').doc(docID);

    docRef.get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const fountainImg = data.photo_name;
                const maintainer = data.maintainer;
                let imgUrl = '';

                if (maintainer === "parks") {
                    imgUrl = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + fountainImg;
                } else if (maintainer === "Engineering") {
                    imgUrl = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/eng/' + fountainImg;
                }

                const imageElement = document.getElementById('fountainImage');
                if (imageElement) {
                    imageElement.src = imgUrl;
                } else {
                    console.error('Image element not found.');
                }
            } else {
                console.error("No such document!");
            }
        })
        .catch(error => {
            console.error("Error getting document:", error);
        });
}

displayImage();
