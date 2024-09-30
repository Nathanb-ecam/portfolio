const elements = document.querySelectorAll('.animate-on-scroll');

console.log("elements",elements)
const observer = new IntersectionObserver((entries) => {
    console.log("elements",elements)
    entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } 
    // else {
    //   entry.target.classList.remove('show');
    // }
  });
});

elements.forEach(el => observer.observe(el));
