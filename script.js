

const menuOpen = document.querySelector('.menu-open');
const menuClose = document.querySelector('.menu-close');
const navLinks = document.querySelector('.nav-links');

if(menuOpen && menuClose){
menuOpen.addEventListener('click', () => {
    navLinks.classList.add('active');
    navLinks.classList.add('mobile-menu');   // 👈 add this
    menuOpen.style.display = 'none';
    menuClose.style.display = 'block';
});

menuClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navLinks.classList.remove('mobile-menu');  // 👈 remove this
    menuOpen.style.display = 'block';
    menuClose.style.display = 'none';
});
}





const slidesContainer = document.querySelector('.slides');
const premiumSlides = document.querySelectorAll('.slide');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

if (slidesContainer && premiumSlides.length > 0) {
    let premiumIndex = 1;
    const slideWidth = premiumSlides[0].clientWidth;

   
    const firstClone = premiumSlides[0].cloneNode(true);
    const lastClone = premiumSlides[premiumSlides.length - 1].cloneNode(true);
    slidesContainer.appendChild(firstClone);
    slidesContainer.insertBefore(lastClone, premiumSlides[0]);

    const allSlides = document.querySelectorAll('.slide');
    slidesContainer.style.transform = `translateX(-${slideWidth * premiumIndex}px)`;

    const moveToSlide = () => {
        slidesContainer.style.transition = "transform 0.8s ease-in-out";
        slidesContainer.style.transform = `translateX(-${slideWidth * premiumIndex}px)`;
    }

    next.addEventListener('click', () => { premiumIndex++; moveToSlide(); });
    prev.addEventListener('click', () => { premiumIndex--; moveToSlide(); });

    slidesContainer.addEventListener('transitionend', () => {
        if(allSlides[premiumIndex] === firstClone){ premiumIndex = 1; slidesContainer.style.transition = "none"; slidesContainer.style.transform = `translateX(-${slideWidth * premiumIndex}px)`; }
        if(allSlides[premiumIndex] === lastClone){ premiumIndex = allSlides.length - 2; slidesContainer.style.transition = "none"; slidesContainer.style.transform = `translateX(-${slideWidth * premiumIndex}px)`; }
    });

    setInterval(() => { premiumIndex++; moveToSlide(); }, 5000);
}

const heroSlides = document.querySelectorAll(".hero-slide");

if (heroSlides.length > 0) {
    let heroIndex = 0;

    function changeSlide() {

        // remove active + reset animation
        heroSlides.forEach(slide => {
            slide.classList.remove("active");
            slide.style.animation = "none";
            slide.offsetHeight; // force reflow
            slide.style.animation = null;
        });

        heroIndex++;
        if (heroIndex >= heroSlides.length) {
            heroIndex = 0;
        }

        heroSlides[heroIndex].classList.add("active");
    }

    setInterval(changeSlide, 6000); // ⚠️ 6 sec (same as CSS animation)
}


const animatedElements = document.querySelectorAll(".animate, .card");

const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const delay = entry.target.dataset.delay || 0;
            entry.target.style.animationDelay = delay + "s";
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
},{threshold:0.2});

animatedElements.forEach(el => animationObserver.observe(el));

const darkModeToggle = document.getElementById("darkModeToggle");
if(darkModeToggle){
    darkModeToggle.onclick = () => document.body.classList.toggle("dark");
}

function closeModal() {
    const modal = document.getElementById("infoModal");
    if (modal) modal.style.display = "none";
}

    // Fetch services from localStorage
    const gallery = document.getElementById("gallery");
    let services = JSON.parse(localStorage.getItem("services")) || [];

    services.forEach(service => {
        const card = document.createElement("div");
        card.className = "card show";

        card.innerHTML = `
            <img src="${service.image}" alt="${service.title}">
            <div class="card-body">
                <h3>${service.title}</h3>
                
                <a href="${service.link}"></a>
            </div>
        `;

        gallery.appendChild(card);
    });
document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("gallery");
    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "card show";

        card.innerHTML = `
            <img src="${project.images[0]}" alt="${project.title}">
            <div class="card-body">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 60)}...</p>
            </div>
        `;

        card.addEventListener("click", () => openProjectModal(project));
        gallery.appendChild(card);
    });
});
function openProjectModal(project) {
    document.getElementById("modalTitle").innerText = project.title;
    document.getElementById("modalDesc").innerText = project.description;

    const imagesDiv = document.getElementById("modalImages");
    imagesDiv.innerHTML = "";

    project.images.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        imagesDiv.appendChild(img);
    });

    document.getElementById("projectModal").style.display = "block";
}

function closeProjectModal() {
    document.getElementById("projectModal").style.display = "none";
}

document.getElementById("serviceForm").addEventListener("submit", function(e){
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    const imageMain = document.getElementById("image").value;
    const image1 = document.getElementById("image1").value;
    const image2 = document.getElementById("image2").value;
    const image3 = document.getElementById("image3").value;

    const link = document.getElementById("link").value;

    const project = {
        title: title,
        description: description,
        images: [imageMain, image1, image2, image3],
        link: link
    };

    let projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects.push(project);

    localStorage.setItem("projects", JSON.stringify(projects));

    alert("Project Added Successfully ✅");

    document.getElementById("serviceForm").reset();
});




// Display projects from localStorage dynamically
document.addEventListener("DOMContentLoaded", () => {
    const gallery = document.getElementById("gallery");
    if(!gallery) return; // stop if gallery doesn't exist

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    projects.forEach(project => {
        if(!project.images || project.images.length === 0) return; // skip empty projects

        const card = document.createElement("div");
        card.className = "card show";

        card.innerHTML = `
            <img src="${project.images[0]}" alt="${project.title}">
            <div class="card-body">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 80)}...</p>
                <button class="view-btn">View Details</button>
            </div>
        `;

        card.querySelector(".view-btn").addEventListener("click", () => {
            openProjectModal(project);
        });

        gallery.appendChild(card);
    });
});

// Modal function
function openProjectModal(project) {
    document.getElementById("modalTitle").innerText = project.title;
    document.getElementById("modalDesc").innerText = project.description;

    const imagesDiv = document.getElementById("modalImages");
    imagesDiv.innerHTML = "";
    project.images.forEach(src => {
    if(!src) return; // skip empty images
    const img = document.createElement("img");
    img.src = src;
    img.style.width = "40%";
    img.style.marginBottom = "10px";
    imagesDiv.appendChild(img);
});

    document.getElementById("projectModal").style.display = "block";
}

function closeProjectModal() {
    document.getElementById("projectModal").style.display = "none";
}