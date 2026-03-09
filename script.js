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

serviceForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const getBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const imageFiles = [
        document.getElementById("image").files[0],
        document.getElementById("image1").files[0],
        document.getElementById("image2").files[0],
        document.getElementById("image3").files[0]
    ];

    const base64Images = [];

    for (let file of imageFiles) {
        if (file) {
            const base64 = await getBase64(file);
            base64Images.push(base64);
        }
    }

    const project = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        images: base64Images
    };

    let projects = JSON.parse(localStorage.getItem("projects")) || [];
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


const residentialGallery = document.getElementById("residentialGallery");
const commercialGallery = document.getElementById("commercialGallery");
const industrialGallery = document.getElementById("industrialGallery");

if (residentialGallery || commercialGallery || industrialGallery) {

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

   projects.forEach((project, index) => {

    if (!project.images || project.images.length === 0) return;

    const card = document.createElement("div");
    card.className = "card";

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

    if (project.category === "residential") {
        residentialGallery.appendChild(card);
    }

    if (project.category === "commercial") {
        commercialGallery.appendChild(card);
    }

    if (project.category === "industrial") {
        industrialGallery.appendChild(card);
    }

});
}
function openCategory(categoryName) {

    const projects = JSON.parse(localStorage.getItem("projects")) || [];

    const filteredProjects = projects.filter(
        project => project.category === categoryName
    );

    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const imagesDiv = document.getElementById("modalImages");

    modalTitle.innerText = categoryName.toUpperCase() + " Projects";
    modalDesc.innerText = "";
    imagesDiv.innerHTML = "";

    if (filteredProjects.length === 0) {
        imagesDiv.innerHTML = "<p>No Projects Available</p>";
    }

  filteredProjects.forEach((project, index) => {

    const card = document.createElement("div");
    card.className = "modal-card";

    card.innerHTML = `
        <img src="${project.images[0]}" class="modal-thumb">
        <h4>${project.title}</h4>
        <button class="view-project-btn">View Project</button>
    `;

    card.querySelector(".view-project-btn")
        .addEventListener("click", () => {
            openProjectDetail(project, index);
        });

    imagesDiv.appendChild(card);
});

    document.getElementById("projectModal").style.display = "block";
}
function openProjectDetail(project, index) {

    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const imagesDiv = document.getElementById("modalImages");

    modalTitle.innerText = project.title;
    modalDesc.innerText = project.description;
    imagesDiv.innerHTML = "";

    project.images.forEach(img => {
        if (img) {
            const image = document.createElement("img");
            image.src = img;
            image.className = "modal-img";
            imagesDiv.appendChild(image);
        }
    });

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete Project";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
        deleteProject(index);
    });

    imagesDiv.appendChild(deleteBtn);
}
