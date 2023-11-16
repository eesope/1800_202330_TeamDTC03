async function writeJSONdata() {

    // var watersRef = db.collection("drinking_fountains");
    // watersRef.add({});

    console.log("writeJSONdata called")

    const response = await fetch("./data/drinking-fountains.json")
    const data = await response.text(); //get string file
    const drinking_fountains = JSON.parse(data); // convert to JSON

    for (x of drinking_fountains) {
        let title = x.name
        let in_operation = x.in_operation;
        let pet_friendly = x.pet_friendly;
        let geo_point = x.geo_point_2d;
        let area = x.geo_local_area;
    }
}
