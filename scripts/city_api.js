function writeJSONdata() {
    fetch("./data/drinking-fountains.json")
        .then(response => response.json())
        .then(data => {
            const batch = db.batch();

            data.forEach((item, index) => {
                // used mapid as uid
                var docRef = db.collection("vancouver_drinking_fountains").doc(item.mapid);
                batch.set(docRef, item);
            });

            return batch.commit().then(() => {
                console.log('Successfully saved data to Firestore');
            });
        })
        .catch(error => {
            console.error('Error reading JSON file or saving to Firestore:', error);
        });
}

// writeJSONdata();