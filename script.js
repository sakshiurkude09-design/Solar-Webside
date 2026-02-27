document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       NAVBAR MOBILE TOGGLE
    ========================== */
    const menuOpen = document.querySelector('.menu-open');
    const menuClose = document.querySelector('.menu-close');
    const navLinks = document.querySelector('.nav-links');

    if (menuOpen && menuClose && navLinks) {
        menuOpen.addEventListener('click', () => {
            navLinks.classList.add('active', 'mobile-menu');
            menuOpen.style.display = 'none';
            menuClose.style.display = 'block';
        });

        menuClose.addEventListener('click', () => {
            navLinks.classList.remove('active', 'mobile-menu');
            menuOpen.style.display = 'block';
            menuClose.style.display = 'none';
        });
    }


    /* =========================
       PREMIUM SLIDER
    ========================== */
    const slidesContainer = document.querySelector('.slides');
    const premiumSlides = document.querySelectorAll('.slide');
    const next = document.querySelector('.next');
    const prev = document.querySelector('.prev');

    if (slidesContainer && premiumSlides.length > 0 && next && prev) {

        let premiumIndex = 1;
        let slideWidth;

function updateSlideWidth() {
    slideWidth = document.querySelector('.slide').clientWidth;
}

updateSlideWidth();
window.addEventListener("resize", updateSlideWidth);
        const firstClone = premiumSlides[0].cloneNode(true);
        const lastClone = premiumSlides[premiumSlides.length - 1].cloneNode(true);

        slidesContainer.appendChild(firstClone);
        slidesContainer.insertBefore(lastClone, premiumSlides[0]);

        const allSlides = document.querySelectorAll('.slide');

        slidesContainer.style.transform =
            `translateX(-${slideWidth * premiumIndex}px)`;

        function moveToSlide() {
            slidesContainer.style.transition = "transform 0.8s ease-in-out";
            slidesContainer.style.transform =
                `translateX(-${slideWidth * premiumIndex}px)`;
        }

        next.addEventListener('click', () => {
            premiumIndex++;
            moveToSlide();
        });

        prev.addEventListener('click', () => {
            premiumIndex--;
            moveToSlide();
        });

        slidesContainer.addEventListener('transitionend', () => {
            if (allSlides[premiumIndex] === firstClone) {
                premiumIndex = 1;
                slidesContainer.style.transition = "none";
                slidesContainer.style.transform =
                    `translateX(-${slideWidth * premiumIndex}px)`;
            }

            if (allSlides[premiumIndex] === lastClone) {
                premiumIndex = allSlides.length - 2;
                slidesContainer.style.transition = "none";
                slidesContainer.style.transform =
                    `translateX(-${slideWidth * premiumIndex}px)`;
            }
        });

        setInterval(() => {
            premiumIndex++;
            moveToSlide();
        }, 3000);
    }


    /* =========================
       HERO SLIDER
    ========================== */
    const heroSlides = document.querySelectorAll(".hero-slide");

    if (heroSlides.length > 0) {

        let heroIndex = 0;

        function changeSlide() {

            heroSlides.forEach(slide => {
                slide.classList.remove("active");
                slide.style.animation = "none";
                slide.offsetHeight;
                slide.style.animation = null;
            });

            heroIndex++;
            if (heroIndex >= heroSlides.length) {
                heroIndex = 0;
            }

            heroSlides[heroIndex].classList.add("active");
        }

        setInterval(changeSlide, 6000);
    }


    /* =========================
       SCROLL ANIMATION
    ========================== */
    const animatedElements = document.querySelectorAll(".animate, .card");

    if (animatedElements.length > 0) {

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.animationDelay = delay + "s";
                    entry.target.classList.add("show");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        animatedElements.forEach(el => observer.observe(el));
    }


    /* =========================
       DARK MODE
    ========================== */
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
        });
    }


    /* =========================
       SERVICE FORM (ADD PROJECT)
    ========================== */
    const serviceForm = document.getElementById("serviceForm");

    if (serviceForm) {
        serviceForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const project = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                images: [
                    document.getElementById("image").value,
                    document.getElementById("image1").value,
                    document.getElementById("image2").value,
                    document.getElementById("image3").value
                ],
                link: document.getElementById("link").value
            };

            let projects =
                JSON.parse(localStorage.getItem("projects")) || [];

            projects.push(project);
            localStorage.setItem("projects", JSON.stringify(projects));

            alert("Project Added Successfully ✅");
            serviceForm.reset();
        });
    }


    /* =========================
       DISPLAY PROJECTS
    ========================== */
    const gallery = document.getElementById("gallery");

    if (gallery) {

        const projects =
            JSON.parse(localStorage.getItem("projects")) || [];

        projects.forEach((project, index) => {

            if (!project.images || project.images.length === 0) return;

            const card = document.createElement("div");
            card.className = "card show";

            card.innerHTML = `
                <img src="${project.images[0]}" alt="${project.title}">
                <div class="card-body">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 80)}...</p>
                    <button class="view-btn">View Details</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            card.querySelector(".view-btn")
                .addEventListener("click", () => openProjectModal(project));

            card.querySelector(".delete-btn")
                .addEventListener("click", () => deleteProject(index));

            gallery.appendChild(card);
        });
    }

});


/* =========================
   MODAL FUNCTIONS
========================== */
function openProjectModal(project) {

    document.getElementById("modalTitle").innerText =
        project.title;

    document.getElementById("modalDesc").innerText =
        project.description;

    const imagesDiv =
        document.getElementById("modalImages");

    imagesDiv.innerHTML = "";

    project.images.forEach(src => {
        if (!src) return;
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


/* =========================
   DELETE FUNCTION
========================== */
function deleteProject(index) {

    let projects =
        JSON.parse(localStorage.getItem("projects")) || [];

    if (confirm("Are you sure you want to delete this project?")) {
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        location.reload();
    }
}

