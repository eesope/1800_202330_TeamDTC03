let fountains = db.collection("vancouver_drinking_fountains")
let reviews = db.collection("reviews")

console.log("sorting called")

const by_distance = fountains.filter(

)
console.log(by_distance);

const by_rating = reviews.sort(
    (a, b) => b.rating - a.rating
)
console.log(by_rating);

const by_pet_friendly = fountains.filter(
    water => water.pet_friendly == 'Y'

)
console.log(by_pet_friendly);
