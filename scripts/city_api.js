console.log("city api called")

async function writeJSONdata() {

    const response = await fetch("./data/drinking-fountains.json");
    const data = await response.text(); //get string file
    const drinkingFountains = JSON.parse(data); // convert to JSON

    var watersRef = db.collection("drinking_fountains");

    for (x of drinkingFountains) {
        mapid = x.mapid;
        title = x.name;
        in_operation = x.in_operation;
        pet_friendly = x.pet_friendly;
        geo_point = x.geo_point_2d;
        area = x.geo_local_area;

        watersRef.add({
            mapid: mapid,
            title: title,
            in_operation: in_operation,
            pet_friendly: pet_friendly,
            geo_point: geo_point,
            area: area
        });
    }
}

// writeJSONdata();
