function writeJSONdata() {
    fetch("./data/drinking-fountains.json")
        .then(response => response.json())
        .then(data => {
            const batch = db.batch();

            data.forEach((item) => {
                // used mapid as uid
                var docRef = db.collection("vancouver_drinking_fountains").doc(item.mapid);
                batch.set(docRef, item);
            });

            return batch.commit().then(() => {
                console.log('Successfully saved data to Firestore.');
            });
        })
        .catch(error => {
            console.error('Error reading JSON file or saving to Firestore:', error);
        });
}

// writeJSONdata();

// to prevent quota exceed, make mock data
function writeSample() {

    console.log("write sample called")

    fetch("./data/drinking-fountains.json")
        .then(response => response.json())
        .then(data => {
            const batch = db.batch();

            let count = 0;

            data.forEach((item) => {
                if (count < 5) {
                    var docRef = db.collection("sample").doc(item.mapid);
                    batch.set(docRef, item);
                    count++;
                }
            });

            if (count = 5) {
                return batch.commit().then(() => {
                    console.log('Sample data is saved.')
                });
            }

        })
        .catch(error => {
            console.error("Error writing sample data:", error);
        });
}
// writeSample();
