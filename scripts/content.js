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