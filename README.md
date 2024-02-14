# Project Title
VanWater

## 1. Project Description
Due to the increasing concerns about water accessibility and the need to reduce single-use plastic bottle waste in Vancouver, we are creating “VanWater”, that is a mobile-first web app to help people in Vancouver find public drinking water fountains with just a few clicks on their phones not wasting time asking people or looking around.

## 2. Demo video
<a href="https://drive.google.com/file/d/1ELY4k3kUiYFt0VgBslCSZUdHOfpPjB_W/view?usp=sharing">Link</a>
	
## 3. Technologies and Resources Used
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* From the city of Vancouver: photo, location, water quality, general information of drinking fountains 
* From Mapbox: map API, map css, navigation
* From Google Fonts: fonts, icons

## 4. Complete setup/installion/usage
  1. Open terminal. Go to a specific path.  Run `git clone https://github.com/tonylai2022/1800_202330_TeamDTC03`
  2. Open the directory of this folder
  3. Open `index.html`
  4. Create an account with your email and your password
  5. Give permission to detect your location 


## 5. Known Bugs and Limitations
Here are some known bugs:
* For unclear reason, some device's live server detecting wrong current location.
* The app reads Firebase database every time it loads; it causes Firebase database quota being used up quickly.

## 6. Features for Future
What we'd like to build in the future:
* Users can post their profile photo
* Users can share the location with others
* Users can edit the reviews
* Users can estimate how much water they drink

## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── README.md                # readme file for general information about the project
├── index.html               # landing HTML file, this is what users see when you come to url
├── account_info.html        # loading account information of specific user
├── content.html             # loading information of each drinking fountain 
├── login.html               # loading login or signup page for a user 
├── main_list.html           # loading list of drinking fountains from database
├── main_map.html            # loading a map and pin sign of drinking fountains from database
├── my_reviews.html          # loading the reviews that the user wrote
├── profile.html             # loading an information that how much plastic bottles user saved
├── saved.html               # loading the bookmarks that the user saved
├── template.html            # template file for the new html page
├── thanks.html              # loading thank you message after user write a review
├── water_quality.html       # loading outside page of water quality information from City of Vancouver
└── writing_reviews.html     # loading a form for user to write a review of specific drinking fountain


It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /logo.png                # VanWater logo
├── scripts                  # Folder for scripts
    /account_info.js         # 
    /authentication.js       #
├── styles                   # Folder for styles
    /style.css               # own styles 
├── data                     # Folder for styles
    /drinking-fountains.json # information about drinking fountains from City of Vancouver
├── text                     # Folder for styles
    /footer.html             # footer including credit information
    /nav_after_login.html    # navigation bar after a user login
    /nav_before_login.html   # navigation bar before a user login

Firebase hosting files: 
├── .firebase
	/hosting..cache
├── .firebaserc
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── storage.rules

```

## 8. Limitations
- Long loading time in view change between map and list
- Long loading time in showing result from sorting feature

## 9. Contact 
* Saeyoung Park - spark363@my.bcit.ca 
* Tony Lai - mlai74@my.bcit.ca
* Ella Song - msong49@my.bcit.ca

## Acknowledgements 
* <a href="https://fonts.google.com/">Google Fonts</a>
* <a href="https://getbootstrap.com/">Bootstrap</a>
* <a href="https://mapbox.com/">Mapbox</a>
* <a href="https://opendata.vancouver.ca/explore/dataset/drinking-fountains/information/?disjunctive.geo_local_area">Open data from City of Vancouver (Drinking Fountain)</a>
