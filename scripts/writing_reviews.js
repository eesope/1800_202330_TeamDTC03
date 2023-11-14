$('#send').click(function(){
    // var file = document.querySelector('#image').files[0];
    // var storageRef = storage.ref();
    // var water_fountain_images = storageRef.child('image/' + file.name);
    // var uploaded_image = water_fountain_images.put(file)

    var review_info = {
        title: $('#title').val(),
        description: $('#description').val(),
        date: new Date(),
    }
    db.collection('reviews').add(review_info).then((result)=>{
        console.log(result)
        window.location.href = "/content.html";
    }).catch((err)=>{
        console.log(err)
    })
})

// Add this JavaScript code to make stars clickable

// Select all elements with the class name "star" and store them in the "stars" variable
const stars = document.querySelectorAll('.star');

// Iterate through each star element
stars.forEach((star, index) => {
    // Add a click event listener to the current star
    star.addEventListener('click', () => {
        // Fill in clicked star and stars before it
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        } 
    });
});