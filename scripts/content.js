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
            document.getElementById("waterName").innerHTML = waterName
        }

        );
}

displayWaterInfo();

function copyClipboard() {
    // get the text field
    var copyText = document.getElementById("waterName").innerText;

    // create a new clipboardItem
    const clipboardItem = new ClipboardItem({ "text/plain": new Blob([copyText], { type: "text/plain" }) });

    // write clipboardItem to clipboard
    navigator.clipboard.write([clipboardItem])
        .then(
            function () {
                alert("Copied the text: " + copyText);
            },
            function (err) {
                console.error("Copy failed: ", err);
            }
        );
}

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
                    let imgElement = reviewCard.querySelector("img");
                    imgElement.src = photoUrl;
                    imgElement.alt = "User uploaded image";
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

    const docRef = db.collection("vancouver_drinking_fountains").doc(docID);

    docRef.get()
        .then(doc => {
            if (doc.exists) {
                const data = doc.data();
                const fountainImg = data.photo_name;
                const maintainer = data.maintainer;
                let imgUrl = '';

                if (fountainImg) { // Check if fountainImg is not null or undefined

                    // Conditionally set the image source based on maintainer
                    if (maintainer == "parks") {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + fountainImg;
                    } else if (maintainer == "Engineering") {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/eng/' + fountainImg;
                    } else {
                        newcard.querySelector('.card-image').src = 'http://vanmapp1.vancouver.ca/photo/drinking_fountains/parks/' + docID + '.jpg';
                    }
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
